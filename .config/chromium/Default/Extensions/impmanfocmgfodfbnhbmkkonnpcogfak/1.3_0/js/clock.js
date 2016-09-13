var clock = function(){
    this.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    this.clockType = (localStorage.clockType || 'analogue');
    this.clockCounter = setInterval(this.setClock.bind(this), 250);
    
    this.lightStatus = (localStorage.lightStatus || 'lights-on');
    
    this.el = {
        lightBtn: this.id('lightswitch'),
        settingsBtn: this.id('open-settings'),
        settingsRadios: document.getElementsByName('clocktype'),
        settingsDropdown: this.id('settings-dropdown'),
        time: this.id('time')
    };
};

clock.prototype.init = function(){
    this.setClockType();
    this.setDateText();
    this.setLights();
    this.setClock();
    
    this.bindEvents();
};

clock.prototype.id = function(id){
    if (!id) return;
    
    return document.getElementById(id);
};


// Set up events
// ---------------------------

clock.prototype.bindEvents = function(){
    document.addEventListener('click', this.documentClick.bind(this), false);
    this.el.lightBtn.addEventListener('click', this.toggleLights.bind(this), false);
    this.el.settingsBtn.addEventListener('click', this.openSettings.bind(this), false);
    
    for (var i=0; i < this.el.settingsRadios.length; i++) {
        this.el.settingsRadios[i].addEventListener('click', this.changeClock.bind(this), false);
        this.el.settingsRadios[i].addEventListener('keyup', this.checkRadioClick.bind(this), false);
    }
};


clock.prototype.documentClick = function(){
    this.el.settingsBtn.className = '';
};

clock.prototype.toggleLights = function(){
    localStorage.lightStatus = this.lightStatus = (this.lightStatus === 'lights-on') ? 'lights-off' : 'lights-on';

    this.setLights();
};

clock.prototype.setLights = function(){
    document.body.className = this.lightStatus;
};

clock.prototype.openSettings = function(e){
    e.stopPropagation();
    
    var btnClass = (this.el.settingsBtn.className === 'active') ? '' : 'active';
    this.el.settingsBtn.className = btnClass;

    for (var i=0; i < this.el.settingsRadios.length; i++) {
        if (this.el.settingsRadios[i].checked) {
            this.el.settingsRadios[i].focus();
            return;
        }
    }
};

clock.prototype.changeClock = function(e){
    e.stopPropagation();
    
    this.setClockType(e.target.id);
};

// Check for spacebar or enter clicks and close the menu
clock.prototype.checkRadioClick = function(e){
    if (e.keyCode === 32 || e.keyCode === 13) {
        this.documentClick();
    }
}


// Set clock type
// --------------------------

clock.prototype.setClockType = function(type){
    // If setClockType is being called without an argument
    if (type === void 0) {
        this.id(this.clockType).checked = true;
    } else {
        localStorage.clockType = type;
        this.clockType = type;
    }
}

clock.prototype.setDateText = function(){
    var d = new Date(),
        thisDay = this.days[d.getDay()],
        thisMonth = this.months[d.getMonth()],
        date = thisDay + ' ' + d.getDate() + ' ' + thisMonth;

    this.id('date').innerHTML = date;
};

// Clock functions
// ---------------------------

clock.prototype.setClock = function(){
    var d = new Date();
    
    this.el.time.className = this.clockType + '-clock';
    
    switch (this.clockType) {
        case 'hr24':
            this.setHr24Clock(d);
            break;
        case 'hr12':
            this.setHr12Clock(d);
            break;
        case 'analogue':
            this.setAnalogueClock(d);
            break;
        default:
            break;
    }
};

clock.prototype.formatZero = function(num){
    return (num < 10) ? '0' + num : num;
}

clock.prototype.setHr24Clock = function(d){
    var html = '<h1>' + this.formatZero(d.getHours()) + ':' + this.formatZero(d.getMinutes()) + '<small>' + this.formatZero(d.getSeconds()) + '</small></h1>';
    this.el.time.innerHTML = html;
};

clock.prototype.setHr12Clock = function(d){
    var hours = d.getHours(),
        timeOfDay = 'am';
    
    if (hours > 12) {
        hours -= 12;
        timeOfDay = 'pm';
    }
    
    var html = '<h1><span>' + timeOfDay + '</span>' + hours + ':' + this.formatZero(d.getMinutes()) + '<small>' + this.formatZero(d.getSeconds()) + '</small></h1>';
    this.el.time.innerHTML = html;
};

clock.prototype.setAnalogueClock = function(d){
    
    // Hours + portion of minutes
    var hourRotation = (360 * (12 + d.getHours() % 12) / 12) + (30 * d.getMinutes() / 60);
    
    // Minutes + portion of seconds
    var minuteRotation = (6 * d.getMinutes()) + (d.getSeconds() / 10);
    
    // Just seconds
    var secondRotation = 6 * d.getSeconds();
    
    var transitionDuration = (secondRotation === 0) ? '0s' : '';
    
    if (this.id('hour-hand') === null) {
        var html = '<div id="hour-hand" style="-webkit-transform: rotate(' + hourRotation + 'deg)"></div>' +
               '<div id="minute-hand" style="-webkit-transform: rotate(' + minuteRotation + 'deg)"></div>' +
               '<div id="second-hand" style="-webkit-transform: rotate(' + secondRotation + 'deg)"></div>';
    
        this.el.time.innerHTML = html;
    } else {
        this.id('hour-hand').style.webkitTransform = 'rotate(' + hourRotation + 'deg)';
        this.id('minute-hand').style.webkitTransform = 'rotate(' + minuteRotation + 'deg)';
        
        var secondHand = this.id('second-hand');
        secondHand.style.webkitTransform = 'rotate(' + secondRotation + 'deg)';
        secondHand.style.webkitTransitionDuration = transitionDuration;
    }
};


window.Clock = new clock();
Clock.init();
