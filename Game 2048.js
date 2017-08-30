        var canvas, context, width, height, grid;
        var isproduce;
        function Grid(n, width, height)
        {
            this.isanimate = false;
            this.width = width;  this.height = height;  this.n = n;
            this.val = new Array(n * n);
            this.time = new Array(n * n);
            for (var i = 0; i < n*n; i++)
            {
                if (i == 3 || i == 12 || i == 7 || i == 10 || i == 8)
                    this.val[i] = 2;
                else if (i == 4)
                    this.val[i] = 4;
                else if (i == 1)
                    this.val[i] = 8;
                else
                    this.val[i] = 0;
            }
        }

        Grid.prototype._drawUnit = function(i, j, xdiff, ydiff)
        {
            let unit_width = this.width/this.n, unit_height = this.height/this.n;
            context.fillStyle = 'orange';
            context.fillRect(unit_width*j + xdiff, unit_height*i + ydiff, unit_width, unit_height);
            context.fillStyle = 'white';
            context.font = '40px Arial';
            context.fillText(this.val[i*this.n+j], unit_width*(j+1/2)-20 + xdiff, unit_height*(i+1/2)+10 + ydiff, 80);
        };

        Grid.prototype.initDraw = function()
        {
            let unit_width = this.width/this.n, unit_height = this.height/this.n;
            context.fillStyle = 'lightgray';
            context.strokeStyle = 'black';
            context.fillRect(0, 0, width, height);
            for (let i = 0; i < this.n; i++)
                for (let j = 0; j < this.n; j++)
                {
                    if (this.val[i*this.n+j] != 0)
                        this._drawUnit(i, j, 0, 0);
                    context.strokeRect(unit_width*j, unit_height*i, unit_width, unit_height);
                }
            context.strokeRect(0, 0, width, height);
        };

        Grid.prototype.rand = function()
        {
            var rand_arr = [];
            for (var i = 0; i < this.n * this.n; i++)
            {
                if (this.val[i] == 0)
                    rand_arr.push(i);
            }
            var len = rand_arr.length;
            var rand_index = Math.round(Math.random() * (len - 0.5));
            var rand_num = rand_arr[rand_index];
            this.val[rand_num] = 2;
        };

        Grid.prototype.animation = function(from, to)
        {
            let unit_width = this.width / this.n, unit_height = this.height / this.n;
            var x =  Math.floor(from / this.n); y = from % this.n;
            var x_from = x * unit_width, y_from = y  * unit_height;
            var x_to = Math.floor(to / this.n) * unit_width, y_to = (to % this.n) * unit_height;
            var step = 5, now_step = 0, unit_x = (x_to - x_from) / step, unit_y = (y_to - y_from) / step;
            var self = this;
            function interval()
            {
                now_step++;
                self.initDraw();
                self._drawUnit(x, y, unit_y * now_step, unit_x * now_step);
                if (step == now_step)
                    clearInterval(self.time[from]);
            }
            this.time[from] = setInterval(interval, 20);
        };

        Grid.prototype.move = function(keycode)
        {
            var n = this.n, val = this.val;
            isproduce = false;
            if (keycode == 37)
            {
                for (let i = 0; i < n; i++)
                {
                    var pos = 0;
                    for (let j = 0; j < n; j++)
                    {
                        if (val[i*n+j] == 0)
                            continue;
                        let tmp_pos = j + 1;
                        while (tmp_pos < n && val[i*n+tmp_pos] == 0)
                            tmp_pos++;
                        if (tmp_pos < n && val[i*n+j] == val[i*n+tmp_pos])
                        {
                            isproduce = true;
                            val[i*n+pos] = 2 * val[i*n+j];
                            val[i*n+tmp_pos] = 0;
                            if (j != pos)
                                val[i*n+j] = 0;
                        }
                        else
                        {
                            val[i*n+pos] = val[i*n+j];
                            if (j != pos)
                            {
                                isproduce = true;
                                val[i*n+j] = 0;
                            }
                        }
                        pos++;
                    }
                }
            }
            else if (keycode == 38)
            {
                for (let j = 0; j < n; j++)
                {
                    var pos = 0;
                    for (let i = 0; i < n; i++)
                    {
                        if (val[i*n+j] == 0)
                            continue;
                        let tmp_pos = i + 1;
                        while (tmp_pos < n && val[tmp_pos*n+j] == 0)
                            tmp_pos++;
                        if (tmp_pos < n && val[i*n+j] == val[tmp_pos*n+j])
                        {
                            isproduce = true;
                            val[pos*n+j] = 2 * val[i*n+j];
                            val[tmp_pos*n+j] = 0;
                            if (i != pos)
                                val[i*n+j] = 0;
                        }
                        else
                        {
                            val[pos*n+j] = val[i*n+j];
                            if (i != pos)
                            {
                                isproduce = true;
                                val[i*n+j] = 0;
                            }
                        }
                        pos++;
                    }
                }
            }
            else if (keycode == 39)
            {
                for (let i = 0; i < n; i++)
                {
                    var pos = n - 1;
                    for (let j = n - 1; j >= 0; j--)
                    {
                        if (val[i*n+j] == 0)
                            continue;
                        let tmp_pos = j - 1;
                        while (tmp_pos >= 0 && val[i*n+tmp_pos] == 0)
                            tmp_pos--;
                        if (tmp_pos >= 0 && val[i*n+j] == val[i*n+tmp_pos])
                        {
                            isproduce = true;
                            val[i*n+pos] = 2 * val[i*n+j];
                            val[i*n+tmp_pos] = 0;
                            if (j != pos)
                                val[i*n+j] = 0;
                        }
                        else
                        {
                            val[i*n+pos] = val[i*n+j];
                            if (j != pos)
                            {
                                isproduce = true;
                                val[i*n+j] = 0;
                            }
                        }
                        pos--;
                    }
                }
            }
            else if (keycode == 40)
            {
                for (let j = 0; j < n; j++)
                {
                    var pos = n - 1;
                    for (let i = n - 1; i >= 0; i--)
                    {
                        if (val[i*n+j] == 0)
                            continue;
                        let tmp_pos = i - 1;
                        while (tmp_pos >= 0 && val[tmp_pos*n+j] == 0)
                            tmp_pos--;
                        if (tmp_pos >= 0 && val[i*n+j] == val[tmp_pos*n+j])
                        {
                            isproduce = true;
                            val[pos*n+j] = 2 * val[i*n+j];
                            val[tmp_pos*n+j] = 0;
                            if (i != pos)
                                val[i*n+j] = 0;
                        }
                        else
                        {
                            val[pos*n+j] = val[i*n+j];
                            if (i != pos)
                            {
                                isproduce = true;
                                val[i*n+j] = 0;
                            }
                        }
                        pos--;
                    }
                }
            }
            if (isproduce)
                this.rand();
            this.initDraw();
        };

        window.onload = function()
        {
            canvas = document.getElementById('mycanvas');
            width = canvas.width; height = canvas.height;
            context = canvas.getContext('2d');
            grid = new Grid(4, width, height);
            grid.initDraw();
            window.onkeyup = function(e)
            {
                grid.move(e.keyCode);
            };
        };