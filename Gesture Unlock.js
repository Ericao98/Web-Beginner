        var canvas, context, width, height, begin, x_unit, y_unit;
        var lines = [];
        // 正确手势
        var correct_order = [0, 1, 4, 3, 6, 7];
        var order = [];

        function initdraw()
        {
            context.fillStyle = 'white';
            context.fillRect(0, 0, width, height);

            begin = {x: 50, y: 50};
            x_unit = (width - 2 * begin.x) / 2, y_unit = (height - 2 * begin.y) / 2;
            context.fillStyle = 'blue';
            for (var i = 0; i < 3; i++)
                for (var j = 0; j < 3; j++)
                {
                    context.beginPath();
                    context.arc(begin.x + x_unit * j, begin.y + y_unit * i, 15, 0, 2*Math.PI, false);
                    context.fill();
                }
        }

        function initline()
        {
            for (var i = 0; i < lines.length - 1; i++)
            {
                context.strokeStyle = 'blue';
                context.beginPath();
                context.moveTo(lines[i].x, lines[i].y);
                context.lineTo(lines[i + 1].x, lines[i + 1].y);
                context.stroke();
            } 
        }

        window.onload = function()
        {
            canvas = document.getElementById('mycanvas');
            width = canvas.width;
            height = canvas.height;
            context = canvas.getContext('2d');
            
            context.lineWidth = 3;
            initdraw();
            initline();

            var isdraw = false, pfrom = {x: 0, y: 0}, pto = {x: 0, y: 0};

            function confirmPoint(p, x, y)
            {
                // debugger;
                for (var i = 0; i < 3; i++)
                    for (var j = 0; j < 3; j++)
                    {
                        var x1 = begin.x + x_unit * j, y1 = begin.y + y_unit * i;
                        if (Math.abs(x - x1) < 50 && Math.abs(y - y1) < 50)
                        {
                            
                            p.x = x1;    p.y = y1;
                            if (lines.length >= 1 && lines[lines.length - 1].x === x1 && lines[lines.length - 1].y === y1)
                            {
                                // console.log(lines);
                                continue;
                            }
                            order.push(3 * i + j);
                            lines.push({x: x1, y: y1});
                            return true;
                        }
                    }
                return false;
            }

            var mouse_down = function(e)
            {
                var x, y;
                if (e.type === 'touchstart')
                {
                    x = e.changedTouches[0].pageX;
                    y = e.changedTouches[0].pageY;
                    // document.getElementById('mark').innerHTML = x + ', ' + y;
                }
                else if (e.type === 'mousedown')
                {
                    x = e.offsetX;
                    y = e.offsetY;
                }
                // document.getElementById('mark').innerHTML = x + ', ' + y;
                isdraw = true;
                confirmPoint(pfrom, x, y);
            };
            var mouse_up = function(e)
            {
                initdraw();
                isdraw = false;
                if (order.length != 0)
                    if(order.every( function(x, i) { if (order.length === correct_order.length && x === correct_order[i]) return true; return false;} ))
                        alert('Right!');
                    else
                        alert('Wrong!');
                order = [];     lines = [];     pfrom = {x: 0, y: 0};
            };
            var mouse_move = function(e)
            {
                var x, y;
                if (e.type === 'touchmove')
                {
                    e.preventDefault();
                    e = e.changedTouches[0];
                    x = e.pageX;
                    y = e.pageY;
                }
                else if (e.type === 'mousemove')
                {
                    x = e.offsetX;
                    y = e.offsetY;
                }
                if (isdraw)
                {
                    initdraw();
                    initline();
                    if (order.length !== 0 || (pfrom.x !== 0 && pfrom.y !== 0))
                    {
                        context.strokeStyle = 'gray';
                        context.beginPath();
                        context.moveTo(pfrom.x, pfrom.y);
                        if (confirmPoint(pto, x, y))
                        {
                            context.lineTo(pto.x, pto.y);
                            pfrom.x = pto.x; pfrom.y = pto.y;
                        }
                        else
                            context.lineTo(x, y);
                        context.stroke();
                    }
                }
            };

            canvas.addEventListener('mousedown', mouse_down, false);
            canvas.addEventListener('mousemove', mouse_move, false);
            canvas.addEventListener('mouseup', mouse_up, false);
            canvas.addEventListener('mouseout', mouse_up, false);

            canvas.addEventListener('touchstart', mouse_down, false);
            canvas.addEventListener('touchmove', mouse_move, false);
            canvas.addEventListener('touchend', mouse_up, false);
        };