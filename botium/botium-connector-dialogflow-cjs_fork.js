'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var util = _interopDefault(require('util'));
var v1 = _interopDefault(require('uuid/v1'));
var dialogflow = _interopDefault(require('dialogflow'));
var lodash = _interopDefault(require('lodash'));
var debug = _interopDefault(require('debug'));

/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function jsonToStructProto(json) {
  var fields = {};
  for (var k in json) {
    fields[k] = jsonValueToProto(json[k]);
  }

  return {fields: fields};
}

var JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP = {};
JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP[typeof 0] = 'numberValue';
JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP[typeof ''] = 'stringValue';
JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP[typeof false] = 'boolValue';

var JSON_SIMPLE_VALUE_KINDS = new Set([
  'numberValue',
  'stringValue',
  'boolValue' ]);

function jsonValueToProto(value) {
  var valueProto = {};

  if (value === null) {
    valueProto.kind = 'nullValue';
    valueProto.nullValue = 'NULL_VALUE';
  } else if (value instanceof Array) {
    valueProto.kind = 'listValue';
    valueProto.listValue = {values: value.map(jsonValueToProto)};
  } else if (typeof value === 'object') {
    valueProto.kind = 'structValue';
    valueProto.structValue = jsonToStructProto(value);
  } else if (typeof value in JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP) {
    var kind = JSON_SIMPLE_TYPE_TO_PROTO_KIND_MAP[typeof value];
    valueProto.kind = kind;
    valueProto[kind] = value;
  } else {
    console.warn('Unsupported value type ', typeof value);
  }
  return valueProto;
}

function structProtoToJson(proto) {
  if (!proto || !proto.fields) {
    return {};
  }
  var json = {};
  for (var k in proto.fields) {
    json[k] = valueProtoToJson(proto.fields[k]);
  }
  return json;
}

function valueProtoToJson(proto) {
  if (!proto || !proto.kind) {
    return null;
  }

  if (JSON_SIMPLE_VALUE_KINDS.has(proto.kind)) {
    return proto[proto.kind];
  } else if (proto.kind === 'nullValue') {
    return null;
  } else if (proto.kind === 'listValue') {
    if (!proto.listValue || !proto.listValue.values) {
      console.warn('Invalid JSON list value proto: ', JSON.stringify(proto));
    }
    return proto.listValue.values.map(valueProtoToJson);
  } else if (proto.kind === 'structValue') {
    return structProtoToJson(proto.structValue);
  } else {
    console.warn('Unsupported JSON value proto kind: ', proto.kind);
    return null;
  }
}

var structjson = {
  jsonToStructProto: jsonToStructProto,
  structProtoToJson: structProtoToJson,
};

var debug$1 = debug('botium-connector-dialogflow');



var Capabilities = {
  DIALOGFLOW_PROJECT_ID: 'DIALOGFLOW_PROJECT_ID',
  DIALOGFLOW_CLIENT_EMAIL: 'DIALOGFLOW_CLIENT_EMAIL',
  DIALOGFLOW_PRIVATE_KEY: 'DIALOGFLOW_PRIVATE_KEY',
  DIALOGFLOW_LANGUAGE_CODE: 'DIALOGFLOW_LANGUAGE_CODE',
  DIALOGFLOW_USE_INTENT: 'DIALOGFLOW_USE_INTENT',
  DIALOGFLOW_INPUT_CONTEXT_NAME: 'DIALOGFLOW_INPUT_CONTEXT_NAME',
  DIALOGFLOW_INPUT_CONTEXT_LIFESPAN: 'DIALOGFLOW_INPUT_CONTEXT_LIFESPAN',
  DIALOGFLOW_INPUT_CONTEXT_PARAMETERS: 'DIALOGFLOW_INPUT_CONTEXT_PARAMETERS'
};

var Defaults = {};
Defaults[Capabilities.DIALOGFLOW_LANGUAGE_CODE] = 'en-US';
Defaults[Capabilities.DIALOGFLOW_USE_INTENT] = false;

var BotiumConnectorDialogflow = function BotiumConnectorDialogflow (ref) {
  var queueBotSays = ref.queueBotSays;
  var caps = ref.caps;

  this.queueBotSays = queueBotSays;
  this.caps = caps;
};

BotiumConnectorDialogflow.prototype.Validate = function Validate () {
    var this$1 = this;

  debug$1('Validate called');
  if (!this.caps[Capabilities.DIALOGFLOW_PROJECT_ID]) { throw new Error('DIALOGFLOW_PROJECT_ID capability required') }
  if (!this.caps[Capabilities.DIALOGFLOW_CLIENT_EMAIL]) { throw new Error('DIALOGFLOW_CLIENT_EMAIL capability required') }
  if (!this.caps[Capabilities.DIALOGFLOW_PRIVATE_KEY]) { throw new Error('DIALOGFLOW_PRIVATE_KEY capability required') }
  if (!this.caps[Capabilities.DIALOGFLOW_LANGUAGE_CODE]) { this.caps[Capabilities.DIALOGFLOW_LANGUAGE_CODE] = Defaults[Capabilities.DIALOGFLOW_LANGUAGE_CODE]; }

  var contextSuffixes = this._getContextSuffixes();
  contextSuffixes.forEach(function (contextSuffix) {
    if (!this$1.caps[Capabilities.DIALOGFLOW_INPUT_CONTEXT_NAME + contextSuffix] || !this$1.caps[Capabilities.DIALOGFLOW_INPUT_CONTEXT_LIFESPAN + contextSuffix]) {
      throw new Error(("DIALOGFLOW_INPUT_CONTEXT_NAME" + contextSuffix + " and DIALOGFLOW_INPUT_CONTEXT_LIFESPAN" + contextSuffix + " capability required"))
    }
  });
  return Promise.resolve()
};

BotiumConnectorDialogflow.prototype.Build = function Build () {
  debug$1('Build called');
  this.sessionOpts = {
    credentials: {
      client_email: this.caps[Capabilities.DIALOGFLOW_CLIENT_EMAIL],
      private_key: this.caps[Capabilities.DIALOGFLOW_PRIVATE_KEY]
    }
  };
  return Promise.resolve()
};

BotiumConnectorDialogflow.prototype.Start = function Start () {
    var this$1 = this;

  debug$1('Start called');

  this.sessionClient = new dialogflow.SessionsClient(this.sessionOpts);
  this.conversationId = v1();
  this.sessionPath = this.sessionClient.sessionPath(this.caps[Capabilities.DIALOGFLOW_PROJECT_ID], this.conversationId);
  this.queryParams = null;

  this.contextClient = new dialogflow.ContextsClient(this.sessionOpts);
  return Promise.all(this._getContextSuffixes().map(function (c) { return this$1._createContext(c); }))
};

BotiumConnectorDialogflow.prototype.UserSays = function UserSays (msg) {
    var this$1 = this;

  debug$1('UserSays called');
  if (!this.sessionClient) { return Promise.reject(new Error('not built')) }

  return new Promise(function (resolve, reject) {
    var request = {
      session: this$1.sessionPath,
      queryInput: {
        text: {
          text: msg.messageText,
          languageCode: this$1.caps[Capabilities.DIALOGFLOW_LANGUAGE_CODE]
        }
      }
    };
    request.queryParams = this$1.queryParams;
    debug$1(("dialogflow request: " + (JSON.stringify(request, null, 2))));

    this$1.sessionClient.detectIntent(request).then(function (responses) {
      var response = responses[0];
      debug$1(("dialogflow response: " + (JSON.stringify(response, null, 2))));

      response.queryResult.outputContexts.forEach(function (context) {
        context.parameters = structjson.jsonToStructProto(
          structjson.structProtoToJson(context.parameters)
        );
      });
      this$1.queryParams = {
        contexts: response.queryResult.outputContexts
      };
      resolve(this$1);

      if (this$1.caps[Capabilities.DIALOGFLOW_USE_INTENT]) {
        if (response.queryResult.intent) {
          var botMsg = { sender: 'bot', sourceData: response.queryResult, messageText: response.queryResult.intent.displayName };
          this$1.queueBotSays(botMsg);
        }
      } else {
        // issue open here: https://github.com/codeforequity-at/botium-connector-dialogflow/issues/2
        console.debug('Detected bot response.');
        if (response.queryResult.fulfillmentText) {
          console.debug('Dialogflow V1 API response detected.');
          var botMsg$1 = { sender: 'bot', sourceData: response.queryResult, messageText: response.queryResult.fulfillmentText };
          this$1.queueBotSays(botMsg$1);
        } else {
          console.debug('Dialogflow V2 API response detected.');
          console.debug('Message: ' + JSON.stringify(response.queryResult.fulfillmentMessages));
          // iterate over messages
          response.queryResult.fulfillmentMessages.forEach(
            function(element) {
              console.debug('Iterating: ' + JSON.stringify(element));
              if (element.text) {
                console.debug('Text object: ' + JSON.stringify(element.text));
                var botMsg$1 = { sender: 'bot', sourceData: response.queryResult, messageText: element.text.text[0] };
                this$1.queueBotSays(botMsg$1);
              }
            });
        }
      }
    }).catch(function (err) {
      reject(new Error(("Cannot send message to dialogflow container: " + (util.inspect(err)))));
    });
  })
};

BotiumConnectorDialogflow.prototype.Stop = function Stop () {
  debug$1('Stop called');
  this.sessionClient = null;
  this.sessionPath = null;
  this.queryParams = null;
  return Promise.resolve()
};

BotiumConnectorDialogflow.prototype.Clean = function Clean () {
  debug$1('Clean called');
  this.sessionOpts = null;
  return Promise.resolve()
};

BotiumConnectorDialogflow.prototype._createContext = function _createContext (contextSuffix) {
  var contextPath = this.contextClient.contextPath(this.caps[Capabilities.DIALOGFLOW_PROJECT_ID],
    this.conversationId, this.caps[Capabilities.DIALOGFLOW_INPUT_CONTEXT_NAME + contextSuffix]);
  var context = {lifespanCount: parseInt(this.caps[Capabilities.DIALOGFLOW_INPUT_CONTEXT_LIFESPAN + contextSuffix]), name: contextPath};
  if (this.caps[Capabilities.DIALOGFLOW_INPUT_CONTEXT_PARAMETERS + contextSuffix]) {
    context.parameters = structjson.jsonToStructProto(this.caps[Capabilities.DIALOGFLOW_INPUT_CONTEXT_PARAMETERS + contextSuffix]);
  }
  var request = {parent: this.sessionPath, context: context};
  return this.contextClient.createContext(request)
};

BotiumConnectorDialogflow.prototype._getContextSuffixes = function _getContextSuffixes () {
  var suffixes = [];
  var contextNameCaps = lodash.pickBy(this.caps, function (v, k) { return k.startsWith(Capabilities.DIALOGFLOW_INPUT_CONTEXT_NAME); });
  lodash(contextNameCaps).keys().sort().each(function (key) {
    suffixes.push(key.substring(Capabilities.DIALOGFLOW_INPUT_CONTEXT_NAME.length));
  });
  return suffixes
};

var botiumConnectorDialogflow = {
  PluginVersion: 1,
  PluginClass: BotiumConnectorDialogflow
};
var botiumConnectorDialogflow_1 = botiumConnectorDialogflow.PluginVersion;
var botiumConnectorDialogflow_2 = botiumConnectorDialogflow.PluginClass;

exports.default = botiumConnectorDialogflow;
exports.PluginVersion = botiumConnectorDialogflow_1;
exports.PluginClass = botiumConnectorDialogflow_2;
//# sourceMappingURL=botium-connector-dialogflow-cjs.js.map
