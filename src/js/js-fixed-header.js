/**
 * Create fixed header in your table.
 * Developed in VanillaJS
 *
 * @param {HTMLElement} [table] - the table object
 * @param {options} [options] - the custom options
 * @constructor
 * @author Julien Stalder
 * @version 1.1.1
 */
JSFixedHeader = function(table,options){

    this.table=null;
    this._fixTable=null;
    this.options=this._getDefaultOptions();

    if(typeof options !="undefined"){
        if(typeof options === 'object') {
            for (var key in options) {
                if (options.hasOwnProperty(key) && typeof this.options[key] !="undefined"){
                    this.options[key] = options[key];
                }
            }
        }
    }
    if(typeof table !="undefined"){
        if(typeof table =="object") {
            this.table=table;
        }else{
            this.table=document.getElementById(table);
        }
        this._createFixHeader();
    }
};


/**
 * Equalize width of cell in fix header
 * @private
 */
JSFixedHeader.prototype._equalizeWidthOfFixHeader = function () {
    if(this._fixTable !== null) {
        if (this.table.style.display != "none") {
            var rowsLength=this.table.tHead.rows.length;

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
 * Auto show hide fix header
 * @private
 */
JSFixedHeader.prototype._showHideFixHeader = function () {
    if(this._fixTable !== null) {
        if (this.table.style.display != "none") {
            if (this._isVisible() && this.table.getBoundingClientRect().top < this.options.top) {
                this._equalizeWidthOfFixHeader();
                this._fixTable.style.display = "block";
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
        if(typeof this.table.id !="undefined" && this.table.id !=null) {
            clone.id = this.table.id + "-fix";
        }

        clone.style.display="none";
        clone.style.top=this.options.top+"px";
        clone.style.zIndex=this.options.zIndex;
        clone.style.position="fixed";
        if(clone.className!=""){
            clone.className+=" js-fixed-header";
        }else{
            clone.className="js-fixed-header";
        }


        var thead=this.table.tHead.cloneNode(true);
        clone.appendChild(thead);
        this.table.parentNode.insertBefore(clone, this.table);
        this._fixTable=clone;

        var that=this;
        that._equalizeWidthOfFixHeader();
        that._showHideFixHeader();

        window.addEventListener("resize", function () {
            that._equalizeWidthOfFixHeader();
        });

        window.addEventListener("scroll",function (){
            that._showHideFixHeader();
        });
    }
};


/**
 * Default options of the plugin
 * @private
 */
JSFixedHeader.prototype._getDefaultOptions = function() {
    return {
        "top":0,
        "zIndex":100
    }
};


/**
 * Return if the table is visible
 * @returns {boolean}
 * @private
 */
JSFixedHeader.prototype._isVisible  = function() {
    if(this.table!=null) {
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