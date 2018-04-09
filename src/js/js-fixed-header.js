/**
 * Create fixed header in your table.
 * Developed in VanillaJS
 *
 * @param {HTMLElement|string} table - the table element or the table id
 * @param {options} [options] - the custom options
 * @constructor
 * @author Julien Stalder
 * @version 1.3.0
 * {@link https://zendre4.github.io/js-fixed-header}.
 */
var JSFixedHeader = function(table,options){

    /**
     * The source table
     * @type {null|HTMLElement}
     */
    this.table=null;

    /**
     * The generated table element
     * @type {null|HTMLElement}
     * @private
     */
    this._fixTable=null;

    /**
     * Init options of the components
     * @type {object}
     * @private
     */
    this._options=this._getDefaultOptions();

    /**
     * Use for know if an animation frame is started (only set if type is js fixed)
     * @type {boolean}
     * @private
     */
    this._scheduledAnimationFrame=false;

    if(typeof options !=="undefined"){
        if(typeof options === 'object') {
            for (var key in options) {
                if (options.hasOwnProperty(key) && typeof this._options[key] !=="undefined"){
                    this._options[key] = options[key];
                }
            }
        }
    }
    if(typeof table !=="undefined"){
        if(typeof table === "object") {
            this.table=table;
        }else{
            this.table=document.getElementById(table);
        }
        this._createFixHeader();
    }
};


/**
 * Type fixed with CSS (with position:fixed).
 * More fluid
 * @const
 * @type {string}
 */
JSFixedHeader.TYPE_CSS_FIXED="css-fixed";

/**
 * Type fixed with JS (with position:absolute).
 * Working better in responsive environment
 * @const
 * @type {string}
 */
JSFixedHeader.TYPE_JS_FIXED="js-fixed";

/**
 * Html table
 * @type {null|HTMLElement}
 */
JSFixedHeader.prototype.table=null;

/**
 * The fixed header table
 * @type {null|HTMLElement}
 * @private
 */
JSFixedHeader.prototype._fixTable=null;

/**
 * Options of the current table
 * @type {null|object}
 * @private
 */
JSFixedHeader.prototype._options=null;

/**
 * Equalize width of cell in fix header
 * @private
 */
JSFixedHeader.prototype._equalizeWidthOfFixHeader = function () {
    if(this._fixTable !== null) {
        if (this.table.style.display !== "none") {
            var rowsLength=this.table.tHead.rows.length;
            if(this._options.type===JSFixedHeader.TYPE_JS_FIXED) {
                this._fixTable.style.width = this.table.clientWidth + "px";
            }
            for (var j = 0; j < rowsLength; j++) {
                var cellsLength = this.table.rows[j].cells.length;

                for (var i = 0; i < cellsLength; i++) {
                    this._fixTable.rows[j].cells[i].style.width = this.table.rows[j].cells[i].getBoundingClientRect().width+"px";
                }
            }
        }
    }
};

/**
 * Fix the absolute position of header (only if type is js fixed)
 * @private
 */
JSFixedHeader.prototype._fixPosition = function () {
    if(this._options.type===JSFixedHeader.TYPE_JS_FIXED) {
        if (this._fixTable !== null) {
            if (this.table.style.display !== "none") {
                if (this._isVisible()) {

                    var bodyRect = document.body.getBoundingClientRect();
                    var elemRect = this.table.getBoundingClientRect();
                    var offset = elemRect.left - bodyRect.left;

                    this._fixTable.style.left = offset + "px";
                }
            }
        }
    }
};


/**
 * Auto show hide fix header
 * @private
 */
JSFixedHeader.prototype._showHideFixHeader = function () {
    if(this._fixTable !== null) {
        if (this.table.style.display !== "none") {
            if (this._isVisible() && this.table.getBoundingClientRect().top < this._options.top) {
                this._equalizeWidthOfFixHeader();
                this._fixTable.style.display = "table";
            } else {
                this._fixTable.style.display = "none";
            }
        }
    }
};

/**
 * Create fix header
 * @private
 */
JSFixedHeader.prototype._createFixHeader = function () {
    if(this._fixTable === null) {

        var clone=this.table.cloneNode(false);
        if(typeof this.table.id !== "undefined" && this.table.id !=null) {
            clone.id = this.table.id + "-fix";
        }
        clone.style.display="none";
        clone.style.top=this._options.top+"px";
        clone.style.zIndex=this._options.zIndex;
        if(clone.className !== ""){
            clone.className+=" js-fixed-header";
        }else{
            clone.className="js-fixed-header";
        }
        clone.className+=" js-fixed-header-type-"+this._options.type;


        var thead=this.table.tHead.cloneNode(true);
        clone.appendChild(thead);

        if(this._options.type===JSFixedHeader.TYPE_JS_FIXED) {
            document.body.insertBefore(clone, document.body.firstChild);
        }else {
            this.table.parentNode.insertBefore(clone, this.table);
        }

        this._fixTable=clone;


        var that=this;
        that._equalizeWidthOfFixHeader();
        that._showHideFixHeader();
        that._callScroll();
        that._fixPosition();

        window.addEventListener("resize", function () {
            that._equalizeWidthOfFixHeader();
            that._fixPosition();
        });


        window.addEventListener("scroll",function (){
            that._showHideFixHeader();
            that._callScroll();
        });
    }
};



/**
 * Call a scroll animation if necessary (only if type is js fixed)
 * @private
 */
JSFixedHeader.prototype._callScroll = function (){
    if(this._options.type===JSFixedHeader.TYPE_JS_FIXED) {
        if (this._isVisible()) {
            if (!this._scheduledAnimationFrame) {
                var raf = window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                if (raf) {
                    var that = this;
                    this._scheduledAnimationFrame = true;

                    raf(function () {
                        that._scheduledAnimationFrame = false;

                        var scrollPosition = (window.pageYOffset || document.documentElement.scrollTop);
                        that._fixTable.style.top = (scrollPosition + that._options.top) + "px";
                    });
                }
            }
        }
    }
};



/**
 * Default options of the plugin
 * @private
 * @return {object}
 */
JSFixedHeader.prototype._getDefaultOptions = function() {
    return {
        "top":0,
        "zIndex":100,
        "type":JSFixedHeader.TYPE_CSS_FIXED,
    };
};


/**
 * Return if the table is visible
 * @returns {boolean}
 * @private
 */
JSFixedHeader.prototype._isVisible  = function() {
    if(this.table!==null) {
        var element=this.table;

        var top = element.offsetTop;
        var left = element.offsetLeft;
        var width = element.offsetWidth;
        var height = element.offsetHeight;

        while (element.offsetParent) {
            element = element.offsetParent;
            top += element.offsetTop;
            left += element.offsetLeft;
        }

        return (
            top < (window.pageYOffset + window.innerHeight) &&
            left < (window.pageXOffset + window.innerWidth) &&
            (top + height) > window.pageYOffset &&
            (left + width) > window.pageXOffset
        );
    }
    return false;
};

/**
 * Destroy the table + the object
 */
JSFixedHeader.prototype.destroy  = function() {
    if(this._fixTable) {
        this._fixTable.parentNode.removeChild(this._fixTable);
        delete this;
    }
};