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

define(['dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/_base/array',
    'dojo/on',
    'dojo/topic',
    'dojo/dnd/move',
    'dijit/_TemplatedMixin',
    'jimu/BaseWidgetPanel',
    'dojox/layout/ResizeHandle'
  ],
  function(
    declare, lang, html, array, on, topic, Move,
    _TemplatedMixin, BaseWidgetPanel, ResizeHandle
  ) {
    /* global jimuConfig */
    return declare([BaseWidgetPanel, _TemplatedMixin], {
      baseClass: 'jimu-widget-panel jimu-title-panel',
      _originalBox: null,
      widgetIcon: null,
      _onResize: false,

      templateString: '<div data-dojo-attach-point="boxNode">' +
          '<div class="title" data-dojo-attach-point="titleNode">' +
            '<div class="title-label jimu-vcenter-text"' +
            'data-dojo-attach-point="titleLabelNode">${label}</div>' +
            '<div class="close-btn jimu-vcenter" data-dojo-attach-point="closeNode"' +
            'data-dojo-attach-event="onclick:_onCloseBtnClicked"></div>' +
            '<div class="pack-btn jimu-vcenter" data-dojo-attach-point="packNode"'+
            'data-dojo-attach-event="onclick:_onPackBtnClicked"></div>' +
          '</div>' +
          '<div class="jimu-container" data-dojo-attach-point="containerNode"></div>' +
        '</div>',

      _onPackBtnClicked: function() {
        var posInfo = this._getPositionInfo();
        if (posInfo.isFull) {
          var isShow = html.getStyle(this.containerNode, 'display') === 'block' ? true : false;
          if (isShow) {
            //hide container
            html.setStyle(this.containerNode, 'display', 'none');
            html.removeClass(this.packNode, 'pack-down');
            html.addClass(this.packNode, 'pack-up');
            html.setStyle(this.domNode, {
              position: 'absolute',
              top: 'auto',
              bottom: 0,
              left: 0,
              right: 0,
              height: 'auto'
            });
          } else {
            //show container
            html.setStyle(this.containerNode, 'display', 'block');
            html.removeClass(this.packNode, 'pack-up');
            html.addClass(this.packNode, 'pack-down');
            html.setStyle(this.domNode, {
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%'
            });
          }
        }
      },

      _onCloseBtnClicked: function() {
        html.setStyle(this.domNode, 'display', 'none');
        this.panelManager.closePanel(this);
      },

      startup: function() {
        this.inherited(arguments);
        this._originalBox = html.getMarginBox(this.domNode);
        this.own(on(this.map, 'click', lang.hitch(this, function() {
          // this.panelManager.closePanel(this);
        })));

        this.resizeHandle = new ResizeHandle({
          targetId: this,
          minWidth: 400,
          minHeight: 410,
          activeResize: false
        }).placeAt(this.domNode);
        this.resizeHandle.startup();
      },

      onOpen: function() {
        html.style(this.domNode, 'display', 'none');
        this.resize();
        html.setStyle(this.domNode, 'display', 'block');
        this.inherited(arguments);
          //ESRI CHANGES
        console.log("On Open Title Panel")
      },

      resize: function(tmp) {
        this.closeNode.style.marginTop = '0px';
        var posInfo = this._getPositionInfo();
        if (posInfo.isFull) {
          this._fullPosition();
          html.removeClass(this.titleNode, 'title-normal');
          html.addClass(this.titleNode, 'title-full');
          html.setStyle(this.resizeHandle.domNode, 'display', 'none');
          html.setStyle(this.packNode, 'display', 'block');
          var isShow = html.getStyle(this.containerNode, 'display') === 'block' ? true : false;
          if (isShow) {
            html.removeClass(this.packNode, 'pack-up');
            html.addClass(this.packNode, 'pack-down');
          }
        } else {
          html.removeClass(this.titleNode, 'title-full');
          html.addClass(this.titleNode, 'title-normal');
          html.setStyle(this.resizeHandle.domNode, 'display', 'block');
          html.setStyle(this.packNode, 'display', 'none');
          this._normalPosition(posInfo.position, tmp);
        }
        this.inherited(arguments);
      },

      destroy: function() {
        this.widgetIcon = null;
        this.inherited(arguments);
      },

      _getPositionInfo: function() {
        var result = {
          isFull: false,
          position: {
            left: 0,
            top: 0
          }
        };
        var layoutBox = html.getMarginBox(jimuConfig.layoutId);
        var widgetIconBox = html.getMarginBox(this.widgetIcon);
        //judge width
        var leftBlankWidth = widgetIconBox.l;
        var rightBlankWidth = layoutBox.w - leftBlankWidth - widgetIconBox.w;
        if (leftBlankWidth >= rightBlankWidth) {
          if (leftBlankWidth >= this._originalBox.w) {
            result.position.left = leftBlankWidth;
          } else {
            result.isFull = true;
            return result;
          }
        } else {
          if (rightBlankWidth >= this._originalBox.w) {
            result.position.left = leftBlankWidth;
          } else {
            result.isFull = true;
            return result;
          }
        }

        //judge height
        var topBlankHeight = widgetIconBox.t;
        var bottomBlankHeight = layoutBox.h - topBlankHeight - widgetIconBox.h;
        if (topBlankHeight >= bottomBlankHeight) {
          if (topBlankHeight >= this._originalBox.h + 3) {
            result.position.top = widgetIconBox.t - this._originalBox.h - 3;
          } else {
            result.isFull = true;
            return result;
          }
        } else {
          if (bottomBlankHeight >= this._originalBox.h + 3) {
            result.position.top = widgetIconBox.t + widgetIconBox.h + 3;
          } else {
            result.isFull = true;
            return result;
          }
        }

        return result;
      },

      _fullPosition: function() {
        html.place(this.domNode, jimuConfig.layoutId);
        var isShowContainer = html.getStyle(this.containerNode, 'display') === 'block';
        if (!isShowContainer) {
          html.setStyle(this.containerNode, 'display', 'block');
        }
        html.setStyle(this.domNode, {
          left: 0,
          width: '100%',
          top: 0,
          bottom: 0,
          height: '100%'
        });
        if (this.moveable) {
          this.moveable.destroy();
          this.moveable = null;
        }
      },

      _normalPosition: function(position, tmp) {
        html.place(this.domNode, jimuConfig.mapId);
        html.setStyle(this.containerNode, 'display', 'block');
        var w = 0;
        var h = 0;
        if (tmp) {
          w = tmp.w;
          h = tmp.h;
        } else {
          w = this._originalBox.w;
          h = this._originalBox.h;
        }
        html.setStyle(this.domNode, {
          left: position.left + 'px',
          top: position.top + 'px',
          width: w + 'px',
          height: h + 'px'
        });
        this._moveableNode(200, 100);
      },

      _moveableNode: function(width, tolerance) {
        if (this.moveable) {
          this.moveable.destroy();
          this.moveable = null;
        }
        var containerBox = html.getMarginBox(jimuConfig.layoutId);
        containerBox.l = containerBox.l - width + tolerance;
        containerBox.w = containerBox.w + 2 * (width - tolerance);

        this.moveable = new Move.boxConstrainedMoveable(this.domNode, {
          box: containerBox,
          handle: this.titleNode,
          within: true
        });
        this.own(on(this.moveable, 'Moving', lang.hitch(this, this.onMoving)));
        this.own(on(this.moveable, 'MoveStop', lang.hitch(this, this.onMoveStop)));
      },

      onMoving: function(mover) {
        html.setStyle(mover.node, 'opacity', 0.9);
      },

      onMoveStop: function(mover) {
        html.setStyle(mover.node, 'opacity', 1);
      }

    });
  });