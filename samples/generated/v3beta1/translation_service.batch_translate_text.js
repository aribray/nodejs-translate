// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

function main(
  parent,
  sourceLanguageCode,
  targetLanguageCodes,
  inputConfigs,
  outputConfig
) {
  // [START translate_v3beta1_generated_TranslationService_BatchTranslateText_async]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Required. Location to make a call. Must refer to a caller's project.
   *  Format: `projects/{project-number-or-id}/locations/{location-id}`.
   *  The `global` location is not supported for batch translation.
   *  Only AutoML Translation models or glossaries within the same region (have
   *  the same location-id) can be used, otherwise an INVALID_ARGUMENT (400)
   *  error is returned.
   */
  // const parent = 'abc123'
  /**
   *  Required. Source language code.
   */
  // const sourceLanguageCode = 'abc123'
  /**
   *  Required. Specify up to 10 language codes here.
   */
  // const targetLanguageCodes = 'abc123'
  /**
   *  Optional. The models to use for translation. Map's key is target language
   *  code. Map's value is model name. Value can be a built-in general model,
   *  or an AutoML Translation model.
   *  The value format depends on model type:
   *  - AutoML Translation models:
   *    `projects/{project-number-or-id}/locations/{location-id}/models/{model-id}`
   *  - General (built-in) models:
   *    `projects/{project-number-or-id}/locations/{location-id}/models/general/nmt`,
   *  If the map is empty or a specific model is
   *  not requested for a language pair, then default google model (nmt) is used.
   */
  // const models = 1234
  /**
   *  Required. Input configurations.
   *  The total number of files matched should be <= 100.
   *  The total content size should be <= 100M Unicode codepoints.
   *  The files must use UTF-8 encoding.
   */
  // const inputConfigs = 1234
  /**
   *  Required. Output configuration.
   *  If 2 input configs match to the same file (that is, same input path),
   *  we don't generate output for duplicate inputs.
   */
  // const outputConfig = ''
  /**
   *  Optional. Glossaries to be applied for translation.
   *  It's keyed by target language code.
   */
  // const glossaries = 1234
  /**
   *  Optional. The labels with user-defined metadata for the request.
   *  Label keys and values can be no longer than 63 characters
   *  (Unicode codepoints), can only contain lowercase letters, numeric
   *  characters, underscores and dashes. International characters are allowed.
   *  Label values are optional. Label keys must start with a letter.
   *  See https://cloud.google.com/translate/docs/labels for more information.
   */
  // const labels = 1234

  // Imports the Translation library
  const {TranslationServiceClient} = require('@google-cloud/translate').v3beta1;

  // Instantiates a client
  const translationClient = new TranslationServiceClient();

  async function batchTranslateText() {
    // Construct request
    const request = {
      parent,
      sourceLanguageCode,
      targetLanguageCodes,
      inputConfigs,
      outputConfig,
    };

    // Run request
    const [operation] = await translationClient.batchTranslateText(request);
    const [response] = await operation.promise();
    console.log(response);
  }

  batchTranslateText();
  // [END translate_v3beta1_generated_TranslationService_BatchTranslateText_async]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
