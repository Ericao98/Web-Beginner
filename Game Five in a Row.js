var canvas, context, width, height;

        function Chess(n, w)
        {
            this.width = w;
            this.padding = (width - this.width) / 2;
            this.n = n || 50;
            this.piece = new Array(this.n), this.val = new Array(this.n);
            for (var i = 0; i < this.n; i++)
            {
                this.val[i] = new Array(this.n);
                this.piece[i] = new Array(this.n);
                for (var j = 0; j < this.n; j++)
                {
                    this.val[i][j] = 0;
                    this.piece[i][j] = -3;
                }
            }
            this.unit = this.width / this.n;
        }
        Chess.prototype.drawPiece = function(boolean, i, j)
        {
            var xgrid = this.padding + i * this.unit;
            var ygrid = this.padding + j * this.unit;
            this.piece[i][j] = (boolean ? -1 : -2);
            context.fillStyle = (boolean ? 'black' : 'white');
            context.beginPath();
            context.arc(xgrid, ygrid, 10, 0, 2*Math.PI, true);
            context.fill();
        };
        Chess.prototype.initDraw = function()
        {
            context.fillStyle = 'gold';
            context.fillRect(0, 0, width, height);
            for(var i = 0; i < this.n; i++)
                for (var j = 0; j < this.n; j++)
                {
                    context.strokeStyle = 'black';
                    context.strokeRect(this.padding + i * this.unit, this.padding + j * this.unit, this.unit, this.unit);
                }
            for (var i = 0; i < 3; i++)
                for (var j = 0; j < 3; j++)
                {
                    context.fillStyle = 'black';
                    context.beginPath();
                    context.arc(this.padding + (6 * i + 3) * this.unit, this.padding + (6 * j + 3) * this.unit, 4, 0, 2*Math.PI, true);
                    context.fill();
                }
        };

        Chess.prototype.calculateValue = function(bi, bj)
        {
            debugger;
            for (var i = bi - 2; i <= bi + 2; i++)
                for (var j = bj - 2; j <= bj + 2; j++)
                {
                    if (this.piece[i][j] != -3 || i < 0 || j < 0)
                        continue;
                    if (this.val[i][j] == 0)
                        this.val[i][j] = this.val[bi][bj] + 3 - Math.max(Math.abs(i - bi), Math.abs(j - bj));
                    else if (this.val[i][j] == 1)
                        this.val[i][j] = this.val[bi][bj] + 5 - Math.max(Math.abs(i - bi), Math.abs(j - bj));
                    else if (this.val[i][j] == 2)
                        this.val[i][j] = this.val[bi][bj] + 7 - Math.max(Math.abs(i - bi), Math.abs(j - bj));
                    else if (this.val[i][j] >= 0)
                        this.val[i][j] = this.val[bi][bj] + 9 - Math.max(Math.abs(i - bi), Math.abs(j - bj));
                }
            var iindex = 0, jindex = 0, max = -4;
            for (var i = 0; i < this.n; i++)
                for (var j = 0; j < this.n; j++)
                {
                    if (this.piece[i][j] == -3 && this.val[i][j] > max)
                    {
                        max = this.val[i][j];
                        iindex = i; jindex = j;
                    }
                }
            this.drawPiece(false, iindex, jindex);
        };

        Chess.prototype.mouseDown = function(x, y)
        {
            var xgrid, ygrid;
            var isbreak = false;
            for (var i = 0; i < this.n; i++)
            {
                for (var j = 0; j < this.n; j++)
                {
                    xgrid = this.padding + i * this.unit;
                    ygrid = this.padding + j * this.unit;
                    if (Math.abs(x - xgrid) <= 10 && Math.abs(y - ygrid) <= 10 && this.piece[i][j] == -3)
                    {
                        this.drawPiece(true, i, j);
                        this.calculateValue(i, j);
                        isbreak = true;  break;
                    }
                }
                if (isbreak)  break;
            }
        };

        var chess;

        window.onload = function()
        {
            canvas = document.getElementById('mycanvas');
            width = canvas.width; height = canvas.height;
            context = canvas.getContext('2d');
            chess = new Chess(18, 600, 600);
            chess.initDraw();
            canvas.onmousedown = function(e)
            {
                var x = e.offsetX, y = e.offsetY;
                chess.mouseDown(x, y);
            };
        };