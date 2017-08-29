var mark, mark2, canvas, context, img, scaler, width, height;

function Scale(scale, radius, x, y)
{
    this.scale = scale;
    this.x = x; this.y = y;
    this.radius = radius;
}
Scale.prototype.move = function(x, y)
{
    this.x = x;
    this.y = y;
};
Scale.prototype.changeRadius = function(boolean)
{
    if (boolean && this.radius < 300)
        this.radius += 5;
    else if (!boolean && this.radius > 20)
        this.radius -= 5;
    this.draw();
    mark2.innerHTML = 'Width: ' + this.radius;
};
Scale.prototype.changeScale = function(boolean)
{
    if (boolean && this.scale < 10)
        this.scale = Math.round((this.scale+0.1)*10) / 10;
    else if (!boolean && this.scale > 0.5)
        this.scale = Math.round((this.scale-0.1)*10) / 10;
    this.draw();
    mark.innerHTML = 'Scale: ' + Math.round(this.scale*10)/10;
};
Scale._reDraw = function()
{
    context.fillStyle = 'lightblue';
    context.fillRect(0, 0, width, height);
    context.drawImage(img, 0, 0);
    context.save();
};
Scale.prototype.bigger = function()
{
    context.restore();
    context.drawImage(img, this.x - this.radius/this.scale, this.y - this.radius/this.scale, this.radius*2/this.scale, this.radius*2/this.scale, this.x - this.radius, this.y - this.radius, this.radius*2, this.radius*2);
};
Scale.prototype.draw = function()
{
    Scale._reDraw();
    this.bigger();
    context.strokeStyle = 'black';
    context.strokeRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
};
window.onload = function()
{
    mark = document.getElementById('mark');
    mark2 = document.getElementById('mark2');
    canvas = document.getElementById('mycanvas');
    width = canvas.clientWidth; height = canvas.clientHeight;
    context = canvas.getContext('2d');
    img = new Image();
    scaler = new Scale(2, 150, 0, 0);
    img.src = 'somePicture.jpg';
    img.onload = function() { context.drawImage(img, 0, 0); };
    canvas.onmousemove = function(e)
    {
        scaler.move(e.offsetX, e.offsetY);
        scaler.draw();
    };
    canvas.onmousewheel = function(e)
    {
        e.preventDefault();
        if (e.wheelDelta > 0)
            scaler.changeScale(true);
        else
            scaler.changeScale(false);
    };
    window.onkeydown = function(e)
    {
        e.preventDefault();
        // debugger;
        if (e.keyCode == 38)
            scaler.changeRadius(true);
        else if (e.keyCode == 40)
            scaler.changeRadius(false);
    };
};
