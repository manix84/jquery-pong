/**
 * ZOMG! jQuery pong!! W00t, yeah.
 * Based on the one by a guy named
 *   @author Ben White <benwhite@columbus.rr.com>
 *   @author Ben Ogle <ben@benogle.com>
 * @author Rob Taylor <manix84@gmail.com>
 */
define([
    'jquery'
], function ($) {
    $.fn.pong = function(options) {
        var defaults = {
            targetSpeed: 30, //ms
            ballAngle: 45, //degrees
            ballSpeed: 8, //pixels per update
            compSpeed: 5, //speed of your opponent!!
            playerSpeed: 5, //pixels per update
            difficulty: 5,
            width: $(this).width, //px
            height: $(this).height, //px
            paddleWidth: 10, //px
            paddleHeight: 40, //px
            paddleBuffer: 1, //px from the edge of the play area
            ballWidth: 14, //px
            ballHeight: 14, //px
            playTo: 10, //points

            // New options
            courtSize: 7, // px
            roundBall: false, // true/false
            sounds: { // OBJECT
                wallImpact: false, // URL
                paddleImpact: false, // URL
                score: false, // URL
                win: false, // URL
                loose: false // URL
            },
            dividerWidth: 10,
            font: 'sans-serif',
            backgroundColor: '#000', // Color Value
            foregroundColor: '#fff' // Color Value
        },
        opts = $.extend(defaults, options);

        ////functions!

        function PositionBall(bolSide, gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard) {

            if (bolSide) {
                gameData.x = opts.width - opts.paddleWidth - opts.paddleBuffer - opts.ballWidth - 10;
            }
            else {
                gameData.x = opts.paddleWidth + opts.paddleBuffer + 10;
            }
            gameData.y = Math.round(Math.random() * (opts.height - ball.height()));

            ball.css('left', gameData.x);
            ball.css('top', gameData.y);

            if (bolSide != (0 > Math.cos(opts.ballAngle * Math.PI / 180) > 0)) {
                opts.ballAngle += 180;
            }

            ball.css('visibility', 'visible');
        }

        var sounds = {
            _muted: false,
            paddleImpact: function () {
                if (opts.sounds && !sounds._muted && opts.sounds.paddleImpact) {
                    var soundFile = document.getElementById('paddleImpactSound');
                    if (soundFile.canPlayType) {
                        soundFile.play();
                    }
                }
            },
            wallImpact: function () {
                if (opts.sounds && !sounds._muted && opts.sounds.wallImpact) {
                    var soundFile = document.getElementById('wallImpactSound');
                    if (soundFile.canPlayType) {
                        soundFile.play();
                    }
                }
            },
            score: function () {
                if (opts.sounds && !sounds._muted && opts.sounds.score) {
                    var soundFile = document.getElementById('scoreSound');
                    if (soundFile.canPlayType) {
                        soundFile.play();
                    }
                }
            },
            win: function () {
                if (opts.sounds && !sounds._muted && opts.sounds.win) {
                    var soundFile = document.getElementById('winSound');
                    if (soundFile.canPlayType) {
                        soundFile.play();
                    }
                }
            },
            loose: function () {
                if (opts.sounds && !sounds._muted && opts.sounds.loose) {
                    var soundFile = document.getElementById('looseSound');
                    if (soundFile.canPlayType) {
                        soundFile.play();
                    }
                }
            },
            mute: function () {
                sounds._muted = !sounds._isMuted;
            }
        };
        window.pongSound = sounds;

        function UpdateScore(bolUser, gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard, msg, result) {

            if (bolUser){
                gameData.playerScore++;
                yourScoreBoard.text(gameData.playerScore);
            }else{
                gameData.compScore++;
                compScoreBoard.text(gameData.compScore);
            }

            if (gameData.playerScore == opts.playTo || gameData.compScore == opts.playTo) {
                ball.css('visibility', 'hidden');
                gameData.gameOver = true;

                result.css('display', 'block');
                if(gameData.playerScore == opts.playTo) {
                    result.append('you win!');
                } else {
                    result.append('you lose :(');
                }

            } else {
                PositionBall(bolUser, gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard);
            }
        }

        // Is run by the setTimeout function. Updates the gameData object.
        function Update(gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard, msg, result) {

            if (gameData.gameOver) {
                msg.html('Click to start!');
                return;
            }

            msg.html('Press ESC to stop');

            // Dynamically Adjust Game Speed

            var tmpDelay = new Date();
            var Diff = tmpDelay.valueOf() - gameData.delay.valueOf() - opts.target;
            gameData.speed += (Diff > 5)?-1:0;
            gameData.speed += (Diff < -5)?1:0;
            gameData.speed = Math.abs(gameData.speed);
            gameData.delay = tmpDelay;

            setTimeout(function () {
                Update(gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard, msg, result);
            }, gameData.speed);

            //    MoveBall

            var d = opts.ballAngle * Math.PI / 180;
            gameData.y += Math.round(opts.ballSpeed * Math.sin(d));
            gameData.x += Math.round(opts.ballSpeed * Math.cos(d));
            var VB = 180 - opts.ballAngle;
            var HB = 0 - opts.ballAngle;

            //    Move Computer

            var LeftTop = parseInt(leftPaddle.css('top'), 10),
                LeftCenter = (opts.paddleHeight/2) + LeftTop,
                Center;
            if (Math.cos(d) > 0 || (gameData.x > opts.width / (2 - (gameData.compAdj / (opts.difficulty * 10))))) {
                Center = (opts.height/2);
            } else {
                Center = (opts.ballHeight/2) + gameData.y;
            }
            var MoveDiff = Math.abs(Center - LeftCenter);
            if (MoveDiff > opts.compSpeed)
                MoveDiff = opts.compSpeed;

            if (Center > LeftCenter)
                LeftTop += MoveDiff;
            else
                LeftTop -= MoveDiff;

            if (LeftTop < 1)
                LeftTop = 1;

            if ((LeftTop+opts.paddleHeight+1) > opts.height) {
                LeftTop = opts.height - opts.paddleHeight - 1;
            }

            leftPaddle.css('top', LeftTop+'px');

            //    Move Player

            var RightTop = parseInt(rightPaddle.css('top'), 10);
            if (gameData.up)
                RightTop -= opts.playerSpeed;
            if (gameData.down)
                RightTop += opts.playerSpeed;

            if (RightTop < 1)
                RightTop = 1;
            if ((RightTop+opts.paddleHeight+1) > opts.height)
                RightTop=opts.height-opts.paddleHeight-1;

            rightPaddle.css('top', RightTop+'px');

            //    Check Top/Bottom/Left/Right

            if (gameData.y < 1) {
                gameData.y = 1;
                opts.ballAngle = HB;
                sounds.wallImpact();
            }

            if (gameData.y > opts.height-opts.ballHeight) {
                gameData.y = opts.height-opts.ballHeight;
                opts.ballAngle = HB;
                sounds.wallImpact();
            }

            if (gameData.x < 1) {
                gameData.x = 1;
                opts.ballAngle = VB;
                gameData.compAdj -= opts.difficulty;
                sounds.score();
                UpdateScore(true, gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard, msg, result);
            }

            if (gameData.x > opts.width-opts.ballWidth) {
                gameData.x=opts.width-opts.ballWidth;
                opts.ballAngle=VB;
                sounds.score();
                UpdateScore(false, gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard, msg, result);
            }

            //    Check Left Paddle

            var MaxLeft = opts.paddleWidth + opts.paddleBuffer;
            if (gameData.x < MaxLeft) {
                if (gameData.y < (opts.paddleHeight + LeftTop) && (gameData.y+opts.ballHeight) > LeftTop) {
                    gameData.x = MaxLeft;
                    opts.ballAngle = VB;
                    gameData.compAdj++;
                    sounds.paddleImpact();
                }
            }

            //    Check Right Paddle

            var MaxRight = opts.width - opts.ballWidth - opts.paddleWidth - opts.paddleBuffer;
            if (gameData.x > MaxRight) {
                if (gameData.y < (opts.paddleHeight + RightTop) && (gameData.y+opts.ballHeight) > RightTop) {
                    gameData.x = MaxRight;
                    opts.ballAngle = VB;
                    sounds.paddleImpact();
                }
            }

            ball.css('top', gameData.y);
            ball.css('left', gameData.x);

            if (gameData.compAdj < 0){
                gameData.compAdj = 0;
            }
        }

        function Start(gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard, msg, result) {

            if (gameData.gameOver) {
                gameData.gameOver = false;
                gameData.playerScore = -1;
                gameData.compScore = -1;

                result.css('display', 'none');
                result.text('');

                setTimeout(function(){
                    Update(gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard, msg, result);
                }, gameData.speed);
                UpdateScore(false, gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard, msg, result);
                UpdateScore(true, gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard, msg, result);
            }
        }

        return this.each(function() {

            var gameData = {
                up: false,                //Down key pressed?
                down: false,            //Down key pressed?
                x: 0,        //Ball X Pos
                y: 0,                    //Ball Y Pos
                compAdj: 0,    //Computer Adjust
                compScore: 0,    //Computer Score
                playerScore: 0,    //Player Score
                speed: 30,    //Actual Game Speed (Dynamic)
                gameOver: true,
                delay: new Date()
            },
            $this = $(this);

            function keyDownEvent(event){
                switch (event.keyCode) {
                    case 38: //Up Arrow
                        gameData.up = true;
                        break;
                    case 40: //Down Arrow
                        gameData.down = true;
                        break;
                    case 27: //Escape
                        $this.children(".ball").css('visibility', 'hidden');
                        gameData.gameOver = true;
                        break;
                }
                return false;
            }

            function keyUpEvent(event){
                switch (event.keyCode) {
                    case 38: //Up Arrow
                        gameData.up = false;
                        break;
                    case 40: //Down Arrow
                        gameData.down = false;
                        break;
                }
                return false;
            }

            $this.css('background', opts.backgroundColor);
            $this.css('position', 'relative');
            $this.css('border-color', opts.foregroundColor);
            $this.css('border-style', 'solid');
            $this.css('border-width', 0);
            $this.css('border-top-width', opts.courtSize);
            $this.css('border-bottom-width', opts.courtSize);
            $this.css('font-family', opts.font);

            $this.append('<textarea class="field" style="position:absolute;background:' + opts.backgroundColor + ';border:0;top:-9999px;left:-9999px;width:0;height0;resize:none;outline:0"></textarea>');
            $this.append('<div class="yourScoreBoard" style="position:absolute;color:' + opts.foregroundColor + ';font-family:inherit;text-align:left;font-weight:bold;font-size:10em">0</div>');
            $this.append('<div class="compScoreBoard" style="position:absolute;color:' + opts.foregroundColor + ';font-family:inherit;text-align:right;font-weight:bold;font-size:10em">0</div>');
            $this.append('<div class="result" style="font-family:inherit;color:' + opts.foregroundColor + ';font-size:5em;position:absolute;text-align:center"></div>');
            $this.append('<div class="leftPaddle" style="position:absolute;background-color:' + opts.foregroundColor + ';"></div>');
            $this.append('<div class="rightPaddle" style="position:absolute;background-color:' + opts.foregroundColor + ';"></div>');
            $this.append('<div class="divider" style="border-style:dashed;width:0;border-color:' + opts.foregroundColor + ';border-width:0;position:absolute"></div>');
            $this.append('<div class="ball" style="position:absolute;visibility:hidden;">&nbsp;</div>');
            $this.append('<div class="msg" style="font-family:inherit;position:absolute;font-size:8pt;color:' + opts.foregroundColor + ';bottom:2px;right:2px;"></div>');

            if (!!opts.sounds) {
                if (!!opts.sounds.paddleImpact) {
                    $this.append('<audio id="paddleImpactSound"><source src="' + opts.sounds.paddleImpact + '" preload="auto" /></audio>');
                }
                if (!!opts.sounds.wallImpact) {
                    $this.append('<audio id="wallImpactSound"><source src="' + opts.sounds.wallImpact + '" preload="auto" /></audio>');
                }
                if (!!opts.sounds.score) {
                    $this.append('<audio id="scoreSound"><source src="' + opts.sounds.score + '" preload="auto" /></audio>');
                }
                if (!!opts.sounds.win) {
                    $this.append('<audio id="winSound"><source src="' + opts.sounds.win + '" preload="auto" /></audio>');
                }
                if (!!opts.sounds.loose) {
                    $this.append('<audio id="looseSound"><source src="' + opts.sounds.loose + '" preload="auto" /></audio>');
                }
            }

            var leftPaddle = $this.children('.leftPaddle');
            var rightPaddle = $this.children('.rightPaddle');
            var ball = $this.children('.ball');
            var yourScoreBoard = $this.children('.yourScoreBoard');
            var compScoreBoard = $this.children('.compScoreBoard');
            var msg = $this.children('.msg');
            var field = $this.children('.field');
            var divider = $this.children('.divider');
            var result = $this.children('.result');

            field.keydown(keyDownEvent);
            field.keyup(keyUpEvent);

            //field.css('width', 200);
            //field.css('height', 20);

            //initialize all
            $this.css('width', opts.width);
            $this.css('height', opts.height);

            leftPaddle.css('width', opts.paddleWidth);
            leftPaddle.css('height', opts.paddleHeight);
            leftPaddle.css('left', opts.paddleBuffer);
            leftPaddle.css('top', Math.round(1 + (Math.random() * (opts.height - opts.paddleHeight - 2))));

            rightPaddle.css('width', opts.paddleWidth);
            rightPaddle.css('height', opts.paddleHeight);
            rightPaddle.css('left', opts.width - opts.paddleWidth - opts.paddleBuffer);
            rightPaddle.css('top', Math.round(1 + (Math.random() * (opts.height - opts.paddleHeight - 2))));

            divider.css('left', (opts.width / 2) - (opts.courtSize / 2));
            divider.css('top', opts.courtSize);
            divider.css('height', opts.height - (opts.courtSize * 3));
            divider.css('border-left-width', opts.courtSize);

            yourScoreBoard.css('left', (opts.width / 2) - (opts.paddleWidth / 2) + (opts.paddleWidth * 2));
            compScoreBoard.css('right', (opts.width / 2) - (opts.paddleWidth / 2) + (opts.paddleWidth * 2));

            result.css('top', (opts.height / 2) - 20);
            result.css('width', opts.width);

            ball.css('width', opts.ballWidth);
            ball.css('height', opts.ballHeight);

            ball.css('display', 'block');
            ball.css('background-color', opts.foregroundColor);
            if (opts.roundBall) {
                ball.css('border-radius', (opts.ballWidth + opts.ballHeight) / 4);
            }

            gameData.speed = opts.targetSpeed;
            Update(gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard, msg, result);

            $this.click(function(){
                field.focus();
                Start(gameData, leftPaddle, rightPaddle, ball, yourScoreBoard, compScoreBoard, msg, result);
            });
        });
    };
});