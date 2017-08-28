var canvas, context, width, height;
var bgcolor = [150, 200, 200], nowcolor = [250, 250, 250]; // Can also use opacity to define color for gradient
var step = [Math.abs(nowcolor[0] - bgcolor[0]), Math.abs(nowcolor[1] - bgcolor[1]), Math.abs(nowcolor[2] - bgcolor[2])];

// A factory function describing the class Wave
function Wave(radius, x, y)
{
    this.can_wave = true;
    this.time = 0;
    this.radius = radius; this.x = x; this.y = y;
    this.nowcolor = nowcolor.map( function(x) { return x; } );
}
Wave._maxradius = 50;
// One of the examples of Functional Programming
Wave._step = step.map(function(x) { return Math.round(x / Wave._maxradius); });

// Use prototype to define 'member function'
Wave.prototype.beginWave = function()
{
    var self = this;
    // debugger;
    function draw()
    {
        // gradienting color from white to rgb(150, 200, 200)
        context.fillStyle = 'rgb(' + self.nowcolor[0] + ', ' + self.nowcolor[1] + ', ' + self.nowcolor[2] + ')';
        context.beginPath();
        context.arc(self.x, self.y, self.radius, 0, 2 * Math.PI, false);
        context.fill();
        self.radius++;
        self.nowcolor = self.nowcolor.map(function(x, i) { return x - Wave._step[i]; });
        self.judgeWave();
    }
    if (this.can_wave)
    {
        this.can_wave = false;
        this.time = setInterval(draw, 5);
    }
};
Wave.prototype.judgeWave = function()
{
    if(!this.can_wave && this.radius >= Wave._maxradius)
    {
        this.can_wave = true;
        clearInterval(this.time);
    }
};

var wave_test;
window.onload = function()
{
    canvas = document.getElementById('mycanvas');
    width = canvas.width;
    height = canvas.height;
    context = canvas.getContext('2d');
    context.fillStyle = 'rgb(' + bgcolor[0] + ', ' + bgcolor[1] + ', ' + bgcolor[2] + ')';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'rgb(' + nowcolor[0] + ', ' + nowcolor[1] + ', ' + nowcolor[2] + ')';
    
    // Add some event listeners
    var ismove = false;
    canvas.onmousedown = function() { if(!ismove) ismove = true; }
    canvas.onmousemove = function(e)
    {
        if (ismove)
        {
            wave_test = new Wave(0, e.offsetX, e.offsetY);
            wave_test.beginWave();

        }
    };
    canvas.onmouseup = function() { if(ismove) ismove = false; }
    canvas.onmouseleave = function() { ismove = false; }
};
