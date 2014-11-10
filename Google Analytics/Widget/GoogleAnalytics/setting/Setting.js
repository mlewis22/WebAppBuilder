///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'dojo/_base/lang',
    'dojo/on',
    "dijit/form/Textarea",
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    lang,
    on) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
        baseClass: 'my-app-setting',
        startup: function () {        
            this.setConfig(this.config);
        },

        setConfig: function (config) {

            // Set the config code here
            document.getElementById("codeInput").value += this.config.code;
    
            this.config = config;
            var codeInput = dijit.byId("codeInput");
            this.codeInput.value = this.config.code

        },

        getConfig: function() {

            // pull the config code from the settings menu here - get is slightly confusing.
            var codeInput = dijit.byId("codeInput");
            this.config.code = this.codeInput.value;
            return this.config;
        }

    });
  });