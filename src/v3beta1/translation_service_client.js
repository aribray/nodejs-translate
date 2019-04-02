// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const gapicConfig = require('./translation_service_client_config.json');
const gax = require('google-gax');
const merge = require('lodash.merge');
const path = require('path');
const protobuf = require('protobufjs');

const VERSION = require('../../../package.json').version;

/**
 * Provides natural language translation operations.
 *
 * @class
 * @memberof v3beta1
 */
class TranslationServiceClient {
  /**
   * Construct an instance of TranslationServiceClient.
   *
   * @param {object} [options] - The configuration object. See the subsequent
   *   parameters for more details.
   * @param {object} [options.credentials] - Credentials object.
   * @param {string} [options.credentials.client_email]
   * @param {string} [options.credentials.private_key]
   * @param {string} [options.email] - Account email address. Required when
   *     using a .pem or .p12 keyFilename.
   * @param {string} [options.keyFilename] - Full path to the a .json, .pem, or
   *     .p12 key downloaded from the Google Developers Console. If you provide
   *     a path to a JSON file, the projectId option below is not necessary.
   *     NOTE: .pem and .p12 require you to specify options.email as well.
   * @param {number} [options.port] - The port on which to connect to
   *     the remote host.
   * @param {string} [options.projectId] - The project ID from the Google
   *     Developer's Console, e.g. 'grape-spaceship-123'. We will also check
   *     the environment variable GCLOUD_PROJECT for your project ID. If your
   *     app is running in an environment which supports
   *     {@link https://developers.google.com/identity/protocols/application-default-credentials Application Default Credentials},
   *     your project ID will be detected automatically.
   * @param {function} [options.promise] - Custom promise module to use instead
   *     of native Promises.
   * @param {string} [options.servicePath] - The domain name of the
   *     API remote host.
   */
  constructor(opts) {
    this._descriptors = {};

    // Ensure that options include the service address and port.
    opts = Object.assign(
      {
        clientConfig: {},
        port: this.constructor.port,
        servicePath: this.constructor.servicePath,
      },
      opts
    );

    // Create a `gaxGrpc` object, with any grpc-specific options
    // sent to the client.
    opts.scopes = this.constructor.scopes;
    const gaxGrpc = new gax.GrpcClient(opts);

    // Save the auth object to the client, for use by other methods.
    this.auth = gaxGrpc.auth;

    // Determine the client header string.
    const clientHeader = [
      `gl-node/${process.version}`,
      `grpc/${gaxGrpc.grpcVersion}`,
      `gax/${gax.version}`,
      `gapic/${VERSION}`,
    ];
    if (opts.libName && opts.libVersion) {
      clientHeader.push(`${opts.libName}/${opts.libVersion}`);
    }

    // Load the applicable protos.
    const protos = merge(
      {},
      gaxGrpc.loadProto(
        path.join(__dirname, '..', '..', 'protos'),
        'google/cloud/translate/v3beta1/translation_service.proto'
      )
    );

    // This API contains "path templates"; forward-slash-separated
    // identifiers to uniquely identify resources within the API.
    // Create useful helper objects for these.
    this._pathTemplates = {
      locationPathTemplate: new gax.PathTemplate(
        'projects/{project}/locations/{location}'
      ),
      glossaryPathTemplate: new gax.PathTemplate(
        'projects/{project}/locations/{location}/glossaries/{glossary}'
      ),
    };

    // Some of the methods on this service return "paged" results,
    // (e.g. 50 results at a time, with tokens to get subsequent
    // pages). Denote the keys used for pagination and results.
    this._descriptors.page = {
      listGlossaries: new gax.PageDescriptor(
        'pageToken',
        'nextPageToken',
        'glossaries'
      ),
    };
    let protoFilesRoot = new gax.GoogleProtoFilesRoot();
    protoFilesRoot = protobuf.loadSync(
      path.join(
        __dirname,
        '..',
        '..',
        'protos',
        'google/cloud/translate/v3beta1/translation_service.proto'
      ),
      protoFilesRoot
    );

    // This API contains "long-running operations", which return a
    // an Operation object that allows for tracking of the operation,
    // rather than holding a request open.
    this.operationsClient = new gax.lro({
      auth: gaxGrpc.auth,
      grpc: gaxGrpc.grpc,
    }).operationsClient(opts);

    const batchTranslateTextResponse = protoFilesRoot.lookup(
      'google.cloud.translation.v3beta1.BatchTranslateResponse'
    );
    const batchTranslateTextMetadata = protoFilesRoot.lookup(
      'google.cloud.translation.v3beta1.BatchTranslateMetadata'
    );
    const createGlossaryResponse = protoFilesRoot.lookup(
      'google.cloud.translation.v3beta1.Glossary'
    );
    const createGlossaryMetadata = protoFilesRoot.lookup(
      'google.cloud.translation.v3beta1.CreateGlossaryMetadata'
    );
    const deleteGlossaryResponse = protoFilesRoot.lookup(
      'google.cloud.translation.v3beta1.DeleteGlossaryResponse'
    );
    const deleteGlossaryMetadata = protoFilesRoot.lookup(
      'google.cloud.translation.v3beta1.DeleteGlossaryMetadata'
    );

    this._descriptors.longrunning = {
      batchTranslateText: new gax.LongrunningDescriptor(
        this.operationsClient,
        batchTranslateTextResponse.decode.bind(batchTranslateTextResponse),
        batchTranslateTextMetadata.decode.bind(batchTranslateTextMetadata)
      ),
      createGlossary: new gax.LongrunningDescriptor(
        this.operationsClient,
        createGlossaryResponse.decode.bind(createGlossaryResponse),
        createGlossaryMetadata.decode.bind(createGlossaryMetadata)
      ),
      deleteGlossary: new gax.LongrunningDescriptor(
        this.operationsClient,
        deleteGlossaryResponse.decode.bind(deleteGlossaryResponse),
        deleteGlossaryMetadata.decode.bind(deleteGlossaryMetadata)
      ),
    };

    // Put together the default options sent with requests.
    const defaults = gaxGrpc.constructSettings(
      'google.cloud.translation.v3beta1.TranslationService',
      gapicConfig,
      opts.clientConfig,
      {'x-goog-api-client': clientHeader.join(' ')}
    );

    // Set up a dictionary of "inner API calls"; the core implementation
    // of calling the API is handled in `google-gax`, with this code
    // merely providing the destination and request information.
    this._innerApiCalls = {};

    // Put together the "service stub" for
    // google.cloud.translation.v3beta1.TranslationService.
    const translationServiceStub = gaxGrpc.createStub(
      protos.google.cloud.translation.v3beta1.TranslationService,
      opts
    );

    // Iterate over each of the methods that the service provides
    // and create an API call method for each.
    const translationServiceStubMethods = [
      'translateText',
      'detectLanguage',
      'getSupportedLanguages',
      'batchTranslateText',
      'createGlossary',
      'listGlossaries',
      'getGlossary',
      'deleteGlossary',
    ];
    for (const methodName of translationServiceStubMethods) {
      this._innerApiCalls[methodName] = gax.createApiCall(
        translationServiceStub.then(
          stub =>
            function() {
              const args = Array.prototype.slice.call(arguments, 0);
              return stub[methodName].apply(stub, args);
            },
          err =>
            function() {
              throw err;
            }
        ),
        defaults[methodName],
        this._descriptors.page[methodName] ||
          this._descriptors.longrunning[methodName]
      );
    }
  }

  /**
   * The DNS address for this API service.
   */
  static get servicePath() {
    return 'translate.googleapis.com';
  }

  /**
   * The port for this API service.
   */
  static get port() {
    return 443;
  }

  /**
   * The scopes needed to make gRPC calls for every method defined
   * in this service.
   */
  static get scopes() {
    return [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/cloud-translation',
    ];
  }

  /**
   * Return the project ID used by this class.
   * @param {function(Error, string)} callback - the callback to
   *   be called with the current project Id.
   */
  getProjectId(callback) {
    return this.auth.getProjectId(callback);
  }

  // -------------------
  // -- Service calls --
  // -------------------

  /**
   * Translates input text and returns translated text.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string[]} request.contents
   *   Required. The content of the input in string format.
   *   We recommend the total contents to be less than 30k codepoints.
   *   Please use BatchTranslateText for larger text.
   * @param {string} request.targetLanguageCode
   *   Required. The BCP-47 language code to use for translation of the input
   *   text, set to one of the language codes listed in Language Support.
   * @param {string} [request.mimeType]
   *   Optional. The format of the source text, for example, "text/html",
   *    "text/plain". If left blank, the MIME type is assumed to be "text/html".
   * @param {string} [request.sourceLanguageCode]
   *   Optional. The BCP-47 language code of the input text if
   *   known, for example, "en-US" or "sr-Latn". Supported language codes are
   *   listed in Language Support. If the source language isn't specified, the API
   *   attempts to identify the source language automatically and returns the
   *   the source language within the response.
   * @param {string} [request.parent]
   *   Optional. Only used when making regionalized call.
   *   Format:
   *   projects/{project-id}/locations/{location-id}.
   *
   *   Only custom model/glossary within the same location-id can be used.
   *   Otherwise 400 is returned.
   * @param {string} [request.model]
   *   Optional. The `model` type requested for this translation.
   *
   *   The format  depends on model type:
   *   1. Custom models:
   *   projects/{project-id}/locations/{location-id}/models/{model-id}.
   *   2. General (built-in) models:
   *   projects/{project-id}/locations/{location-id}/models/general/nmt
   *   projects/{project-id}/locations/{location-id}/models/general/base
   *
   *   For global (non-regionalized) requests, use {location-id} 'global'.
   *   For example,
   *   projects/{project-id}/locations/global/models/general/nmt
   *
   *   If missing, the system decides which google base model to use.
   * @param {Object} [request.glossaryConfig]
   *   Optional. Glossary to be applied. The glossary needs to be in the same
   *   region as the model, otherwise an INVALID_ARGUMENT error is returned.
   *
   *   This object should have the same structure as [TranslateTextGlossaryConfig]{@link google.cloud.translation.v3beta1.TranslateTextGlossaryConfig}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [TranslateTextResponse]{@link google.cloud.translation.v3beta1.TranslateTextResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [TranslateTextResponse]{@link google.cloud.translation.v3beta1.TranslateTextResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const translate = require('@google-cloud/translate');
   *
   * const client = new translate.v3beta1.TranslationServiceClient({
   *   // optional auth parameters.
   * });
   *
   * const contents = [];
   * const targetLanguageCode = '';
   * const request = {
   *   contents: contents,
   *   targetLanguageCode: targetLanguageCode,
   * };
   * client.translateText(request)
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  translateText(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      parent: request.parent,
    });

    return this._innerApiCalls.translateText(request, options, callback);
  }

  /**
   * Detects the language of text within a request.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} [request.parent]
   *   Optional. Only used when making regionalized call.
   *   Format:
   *   projects/{project-id}/locations/{location-id}.
   *
   *   Only custom model within the same location-id can be used.
   *   Otherwise 400 is returned.
   * @param {string} [request.model]
   *   Optional. The language detection model to be used.
   *   projects/{project-id}/locations/{location-id}/models/language-detection/{model-id}
   *   If not specified, default will be used.
   * @param {string} [request.content]
   *   The content of the input stored as a string.
   * @param {string} [request.mimeType]
   *   Optional. The format of the source text, for example, "text/html",
   *   "text/plain". If left blank, the MIME type is assumed to be "text/html".
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [DetectLanguageResponse]{@link google.cloud.translation.v3beta1.DetectLanguageResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [DetectLanguageResponse]{@link google.cloud.translation.v3beta1.DetectLanguageResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const translate = require('@google-cloud/translate');
   *
   * const client = new translate.v3beta1.TranslationServiceClient({
   *   // optional auth parameters.
   * });
   *
   *
   * client.detectLanguage({})
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  detectLanguage(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      parent: request.parent,
    });

    return this._innerApiCalls.detectLanguage(request, options, callback);
  }

  /**
   * Returns a list of supported languages for translation.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} [request.parent]
   *   Optional. Used for making regionalized calls.
   *   Format: projects/{project-id}/locations/{location-id}.
   *   For global calls, use projects/{project-id}/locations/global.
   *   If missing, the call is treated as a global call.
   *
   *   Only custom model within the same location-id can be used.
   *   Otherwise 400 is returned.
   * @param {string} [request.displayLanguageCode]
   *   Optional. The language to use to return localized, human readable names
   *   of supported languages. If missing, default language is ENGLISH.
   * @param {string} [request.model]
   *   Optional. Get supported languages of this model.
   *   The format depends on model type:
   *   1. Custom models:
   *   projects/{project-id}/locations/{location-id}/models/{model-id}.
   *   2. General (built-in) models:
   *   projects/{project-id}/locations/{location-id}/models/general/nmt
   *   projects/{project-id}/locations/{location-id}/models/general/base
   *   Returns languages supported by the specified model.
   *   If missing, we get supported languages of Google general NMT model.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [SupportedLanguages]{@link google.cloud.translation.v3beta1.SupportedLanguages}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [SupportedLanguages]{@link google.cloud.translation.v3beta1.SupportedLanguages}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const translate = require('@google-cloud/translate');
   *
   * const client = new translate.v3beta1.TranslationServiceClient({
   *   // optional auth parameters.
   * });
   *
   *
   * client.getSupportedLanguages({})
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  getSupportedLanguages(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      parent: request.parent,
    });

    return this._innerApiCalls.getSupportedLanguages(
      request,
      options,
      callback
    );
  }

  /**
   * Translates a large volume of text in asynchronous batch mode.
   * This function provides real-time output as the inputs are being processed.
   * If caller cancels a request, the partial results (for an input file, it's
   * all or nothing) may still be available on the specified output location.
   *
   * This call returns immediately and you can
   * use google.longrunning.Operation.name to poll the status of the call.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.sourceLanguageCode
   *   Required. Source language code.
   * @param {string[]} request.targetLanguageCodes
   *   Required. Specify up to 10 language codes here.
   * @param {Object[]} request.inputConfigs
   *   Required. Input configurations.
   *   The total number of files matched should be <= 1000.
   *   The total content size should be <= 100M Unicode codepoints.
   *   The files must use UTF-8 encoding.
   *
   *   This object should have the same structure as [InputConfig]{@link google.cloud.translation.v3beta1.InputConfig}
   * @param {Object} request.outputConfig
   *   Required. Output configuration.
   *   If 2 input configs match to the same file (that is, same input path),
   *   we don't generate output for duplicate inputs.
   *
   *   This object should have the same structure as [OutputConfig]{@link google.cloud.translation.v3beta1.OutputConfig}
   * @param {string} [request.parent]
   *   Optional. Only used when making regionalized call.
   *   Format:
   *   projects/{project-id}/locations/{location-id}.
   *
   *   Only custom models/glossaries within the same location-id can be used.
   *   Otherwise 400 is returned.
   * @param {Object.<string, string>} [request.models]
   *   Optional. The models to use for translation. Map's key is target language
   *   code. Map's value is model name. Value can be a built-in general model,
   *   or a custom model built by AutoML.
   *
   *   The value format depends on model type:
   *   1. Custom models:
   *   projects/{project-id}/locations/{location-id}/models/{model-id}.
   *   2. General (built-in) models:
   *   projects/{project-id}/locations/{location-id}/models/general/nmt
   *   projects/{project-id}/locations/{location-id}/models/general/base
   *
   *   If the map is empty or a specific model is
   *   not requested for a language pair, then default google model is used.
   * @param {Object.<string, Object>} [request.glossaries]
   *   Optional. Glossaries to be applied for translation.
   *   It's keyed by target language code.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is a [gax.Operation]{@link https://googleapis.github.io/gax-nodejs/Operation} object.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is a [gax.Operation]{@link https://googleapis.github.io/gax-nodejs/Operation} object.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const translate = require('@google-cloud/translate');
   *
   * const client = new translate.v3beta1.TranslationServiceClient({
   *   // optional auth parameters.
   * });
   *
   * const sourceLanguageCode = '';
   * const targetLanguageCodes = [];
   * const inputConfigs = [];
   * const outputConfig = {};
   * const request = {
   *   sourceLanguageCode: sourceLanguageCode,
   *   targetLanguageCodes: targetLanguageCodes,
   *   inputConfigs: inputConfigs,
   *   outputConfig: outputConfig,
   * };
   *
   * // Handle the operation using the promise pattern.
   * client.batchTranslateText(request)
   *   .then(responses => {
   *     const [operation, initialApiResponse] = responses;
   *
   *     // Operation#promise starts polling for the completion of the LRO.
   *     return operation.promise();
   *   })
   *   .then(responses => {
   *     const result = responses[0];
   *     const metadata = responses[1];
   *     const finalApiResponse = responses[2];
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * const sourceLanguageCode = '';
   * const targetLanguageCodes = [];
   * const inputConfigs = [];
   * const outputConfig = {};
   * const request = {
   *   sourceLanguageCode: sourceLanguageCode,
   *   targetLanguageCodes: targetLanguageCodes,
   *   inputConfigs: inputConfigs,
   *   outputConfig: outputConfig,
   * };
   *
   * // Handle the operation using the event emitter pattern.
   * client.batchTranslateText(request)
   *   .then(responses => {
   *     const [operation, initialApiResponse] = responses;
   *
   *     // Adding a listener for the "complete" event starts polling for the
   *     // completion of the operation.
   *     operation.on('complete', (result, metadata, finalApiResponse) => {
   *       // doSomethingWith(result);
   *     });
   *
   *     // Adding a listener for the "progress" event causes the callback to be
   *     // called on any change in metadata when the operation is polled.
   *     operation.on('progress', (metadata, apiResponse) => {
   *       // doSomethingWith(metadata)
   *     });
   *
   *     // Adding a listener for the "error" event handles any errors found during polling.
   *     operation.on('error', err => {
   *       // throw(err);
   *     });
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * const sourceLanguageCode = '';
   * const targetLanguageCodes = [];
   * const inputConfigs = [];
   * const outputConfig = {};
   * const request = {
   *   sourceLanguageCode: sourceLanguageCode,
   *   targetLanguageCodes: targetLanguageCodes,
   *   inputConfigs: inputConfigs,
   *   outputConfig: outputConfig,
   * };
   *
   * // Handle the operation using the await pattern.
   * const [operation] = await client.batchTranslateText(request);
   *
   * const [response] = await operation.promise();
   */
  batchTranslateText(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      parent: request.parent,
    });

    return this._innerApiCalls.batchTranslateText(request, options, callback);
  }

  /**
   * Creates a glossary and returns the long-running operation. Returns
   * NOT_FOUND, if the project doesn't exist.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   Required. The project name.
   * @param {Object} request.glossary
   *   Required. The glossary to create.
   *
   *   This object should have the same structure as [Glossary]{@link google.cloud.translation.v3beta1.Glossary}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is a [gax.Operation]{@link https://googleapis.github.io/gax-nodejs/Operation} object.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is a [gax.Operation]{@link https://googleapis.github.io/gax-nodejs/Operation} object.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const translate = require('@google-cloud/translate');
   *
   * const client = new translate.v3beta1.TranslationServiceClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedParent = client.locationPath('[PROJECT]', '[LOCATION]');
   * const glossary = {};
   * const request = {
   *   parent: formattedParent,
   *   glossary: glossary,
   * };
   *
   * // Handle the operation using the promise pattern.
   * client.createGlossary(request)
   *   .then(responses => {
   *     const [operation, initialApiResponse] = responses;
   *
   *     // Operation#promise starts polling for the completion of the LRO.
   *     return operation.promise();
   *   })
   *   .then(responses => {
   *     const result = responses[0];
   *     const metadata = responses[1];
   *     const finalApiResponse = responses[2];
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * const formattedParent = client.locationPath('[PROJECT]', '[LOCATION]');
   * const glossary = {};
   * const request = {
   *   parent: formattedParent,
   *   glossary: glossary,
   * };
   *
   * // Handle the operation using the event emitter pattern.
   * client.createGlossary(request)
   *   .then(responses => {
   *     const [operation, initialApiResponse] = responses;
   *
   *     // Adding a listener for the "complete" event starts polling for the
   *     // completion of the operation.
   *     operation.on('complete', (result, metadata, finalApiResponse) => {
   *       // doSomethingWith(result);
   *     });
   *
   *     // Adding a listener for the "progress" event causes the callback to be
   *     // called on any change in metadata when the operation is polled.
   *     operation.on('progress', (metadata, apiResponse) => {
   *       // doSomethingWith(metadata)
   *     });
   *
   *     // Adding a listener for the "error" event handles any errors found during polling.
   *     operation.on('error', err => {
   *       // throw(err);
   *     });
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * const formattedParent = client.locationPath('[PROJECT]', '[LOCATION]');
   * const glossary = {};
   * const request = {
   *   parent: formattedParent,
   *   glossary: glossary,
   * };
   *
   * // Handle the operation using the await pattern.
   * const [operation] = await client.createGlossary(request);
   *
   * const [response] = await operation.promise();
   */
  createGlossary(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      parent: request.parent,
    });

    return this._innerApiCalls.createGlossary(request, options, callback);
  }

  /**
   * Lists glossaries in a project. Returns NOT_FOUND, if the project doesn't
   * exist.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} [request.parent]
   *   Required. The name of the project from which to list all of the glossaries.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {string} [request.filter]
   *   Optional. Filter specifying constraints of a list operation.
   *   For example, `tags.glossary_name="products*"`.
   *   If missing, no filtering is performed.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Array, ?Object, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is Array of [Glossary]{@link google.cloud.translation.v3beta1.Glossary}.
   *
   *   When autoPaginate: false is specified through options, it contains the result
   *   in a single response. If the response indicates the next page exists, the third
   *   parameter is set to be used for the next request object. The fourth parameter keeps
   *   the raw response object of an object representing [ListGlossariesResponse]{@link google.cloud.translation.v3beta1.ListGlossariesResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is Array of [Glossary]{@link google.cloud.translation.v3beta1.Glossary}.
   *
   *   When autoPaginate: false is specified through options, the array has three elements.
   *   The first element is Array of [Glossary]{@link google.cloud.translation.v3beta1.Glossary} in a single response.
   *   The second element is the next request object if the response
   *   indicates the next page exists, or null. The third element is
   *   an object representing [ListGlossariesResponse]{@link google.cloud.translation.v3beta1.ListGlossariesResponse}.
   *
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const translate = require('@google-cloud/translate');
   *
   * const client = new translate.v3beta1.TranslationServiceClient({
   *   // optional auth parameters.
   * });
   *
   * // Iterate over all elements.
   * client.listGlossaries({})
   *   .then(responses => {
   *     const resources = responses[0];
   *     for (const resource of resources) {
   *       // doThingsWith(resource)
   *     }
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * // Or obtain the paged response.
   *
   * const options = {autoPaginate: false};
   * const callback = responses => {
   *   // The actual resources in a response.
   *   const resources = responses[0];
   *   // The next request if the response shows that there are more responses.
   *   const nextRequest = responses[1];
   *   // The actual response object, if necessary.
   *   // const rawResponse = responses[2];
   *   for (const resource of resources) {
   *     // doThingsWith(resource);
   *   }
   *   if (nextRequest) {
   *     // Fetch the next page.
   *     return client.listGlossaries(nextRequest, options).then(callback);
   *   }
   * }
   * client.listGlossaries({}, options)
   *   .then(callback)
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  listGlossaries(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      parent: request.parent,
    });

    return this._innerApiCalls.listGlossaries(request, options, callback);
  }

  /**
   * Equivalent to {@link listGlossaries}, but returns a NodeJS Stream object.
   *
   * This fetches the paged responses for {@link listGlossaries} continuously
   * and invokes the callback registered for 'data' event for each element in the
   * responses.
   *
   * The returned object has 'end' method when no more elements are required.
   *
   * autoPaginate option will be ignored.
   *
   * @see {@link https://nodejs.org/api/stream.html}
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} [request.parent]
   *   Required. The name of the project from which to list all of the glossaries.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {string} [request.filter]
   *   Optional. Filter specifying constraints of a list operation.
   *   For example, `tags.glossary_name="products*"`.
   *   If missing, no filtering is performed.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @returns {Stream}
   *   An object stream which emits an object representing [Glossary]{@link google.cloud.translation.v3beta1.Glossary} on 'data' event.
   *
   * @example
   *
   * const translate = require('@google-cloud/translate');
   *
   * const client = new translate.v3beta1.TranslationServiceClient({
   *   // optional auth parameters.
   * });
   *
   *
   * client.listGlossariesStream({})
   *   .on('data', element => {
   *     // doThingsWith(element)
   *   }).on('error', err => {
   *     console.log(err);
   *   });
   */
  listGlossariesStream(request, options) {
    options = options || {};

    return this._descriptors.page.listGlossaries.createStream(
      this._innerApiCalls.listGlossaries,
      request,
      options
    );
  }

  /**
   * Gets a glossary. Returns NOT_FOUND, if the glossary doesn't
   * exist.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   Required. The name of the glossary to retrieve.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [Glossary]{@link google.cloud.translation.v3beta1.Glossary}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [Glossary]{@link google.cloud.translation.v3beta1.Glossary}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const translate = require('@google-cloud/translate');
   *
   * const client = new translate.v3beta1.TranslationServiceClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedName = client.glossaryPath('[PROJECT]', '[LOCATION]', '[GLOSSARY]');
   * client.getGlossary({name: formattedName})
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  getGlossary(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      name: request.name,
    });

    return this._innerApiCalls.getGlossary(request, options, callback);
  }

  /**
   * Deletes a glossary, or cancels glossary construction
   * if the glossary isn't created yet.
   * Returns NOT_FOUND, if the glossary doesn't exist.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   Required. The name of the glossary to delete.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is a [gax.Operation]{@link https://googleapis.github.io/gax-nodejs/Operation} object.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is a [gax.Operation]{@link https://googleapis.github.io/gax-nodejs/Operation} object.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const translate = require('@google-cloud/translate');
   *
   * const client = new translate.v3beta1.TranslationServiceClient({
   *   // optional auth parameters.
   * });
   *
   * const formattedName = client.glossaryPath('[PROJECT]', '[LOCATION]', '[GLOSSARY]');
   *
   * // Handle the operation using the promise pattern.
   * client.deleteGlossary({name: formattedName})
   *   .then(responses => {
   *     const [operation, initialApiResponse] = responses;
   *
   *     // Operation#promise starts polling for the completion of the LRO.
   *     return operation.promise();
   *   })
   *   .then(responses => {
   *     const result = responses[0];
   *     const metadata = responses[1];
   *     const finalApiResponse = responses[2];
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * const formattedName = client.glossaryPath('[PROJECT]', '[LOCATION]', '[GLOSSARY]');
   *
   * // Handle the operation using the event emitter pattern.
   * client.deleteGlossary({name: formattedName})
   *   .then(responses => {
   *     const [operation, initialApiResponse] = responses;
   *
   *     // Adding a listener for the "complete" event starts polling for the
   *     // completion of the operation.
   *     operation.on('complete', (result, metadata, finalApiResponse) => {
   *       // doSomethingWith(result);
   *     });
   *
   *     // Adding a listener for the "progress" event causes the callback to be
   *     // called on any change in metadata when the operation is polled.
   *     operation.on('progress', (metadata, apiResponse) => {
   *       // doSomethingWith(metadata)
   *     });
   *
   *     // Adding a listener for the "error" event handles any errors found during polling.
   *     operation.on('error', err => {
   *       // throw(err);
   *     });
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * const formattedName = client.glossaryPath('[PROJECT]', '[LOCATION]', '[GLOSSARY]');
   *
   * // Handle the operation using the await pattern.
   * const [operation] = await client.deleteGlossary({name: formattedName});
   *
   * const [response] = await operation.promise();
   */
  deleteGlossary(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};
    options.otherArgs = options.otherArgs || {};
    options.otherArgs.headers = options.otherArgs.headers || {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = gax.routingHeader.fromParams({
      name: request.name,
    });

    return this._innerApiCalls.deleteGlossary(request, options, callback);
  }

  // --------------------
  // -- Path templates --
  // --------------------

  /**
   * Return a fully-qualified location resource name string.
   *
   * @param {String} project
   * @param {String} location
   * @returns {String}
   */
  locationPath(project, location) {
    return this._pathTemplates.locationPathTemplate.render({
      project: project,
      location: location,
    });
  }

  /**
   * Return a fully-qualified glossary resource name string.
   *
   * @param {String} project
   * @param {String} location
   * @param {String} glossary
   * @returns {String}
   */
  glossaryPath(project, location, glossary) {
    return this._pathTemplates.glossaryPathTemplate.render({
      project: project,
      location: location,
      glossary: glossary,
    });
  }

  /**
   * Parse the locationName from a location resource.
   *
   * @param {String} locationName
   *   A fully-qualified path representing a location resources.
   * @returns {String} - A string representing the project.
   */
  matchProjectFromLocationName(locationName) {
    return this._pathTemplates.locationPathTemplate.match(locationName).project;
  }

  /**
   * Parse the locationName from a location resource.
   *
   * @param {String} locationName
   *   A fully-qualified path representing a location resources.
   * @returns {String} - A string representing the location.
   */
  matchLocationFromLocationName(locationName) {
    return this._pathTemplates.locationPathTemplate.match(locationName)
      .location;
  }

  /**
   * Parse the glossaryName from a glossary resource.
   *
   * @param {String} glossaryName
   *   A fully-qualified path representing a glossary resources.
   * @returns {String} - A string representing the project.
   */
  matchProjectFromGlossaryName(glossaryName) {
    return this._pathTemplates.glossaryPathTemplate.match(glossaryName).project;
  }

  /**
   * Parse the glossaryName from a glossary resource.
   *
   * @param {String} glossaryName
   *   A fully-qualified path representing a glossary resources.
   * @returns {String} - A string representing the location.
   */
  matchLocationFromGlossaryName(glossaryName) {
    return this._pathTemplates.glossaryPathTemplate.match(glossaryName)
      .location;
  }

  /**
   * Parse the glossaryName from a glossary resource.
   *
   * @param {String} glossaryName
   *   A fully-qualified path representing a glossary resources.
   * @returns {String} - A string representing the glossary.
   */
  matchGlossaryFromGlossaryName(glossaryName) {
    return this._pathTemplates.glossaryPathTemplate.match(glossaryName)
      .glossary;
  }
}

module.exports = TranslationServiceClient;
