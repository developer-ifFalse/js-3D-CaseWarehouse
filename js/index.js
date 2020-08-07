let len, xWidth = 5, yHeight = 5, zValue = 5;
let oUl = document.getElementById("list").children[0];
let aLi = oUl.children;
len = xWidth * yHeight * zValue;

// 初始化
(function () {
    for (let i = 0; i < len; i++) {
        let oLi = document.createElement("li");
        oLi.index = i;

        oLi.x = i % 5;
        oLi.y = Math.floor(i % 25 / 5);
        oLi.z = Math.floor(i / 25);

        let data = flyData[i % flyData.length];
        oLi.innerHTML = `
        <b class="cover"></b>
        <p class="title"> ${data.type} </p>
        <p class="author"> ${data.author} </p>
        <p class="time"> ${data.time} </p>
        `

        let tx = Math.random() * 6000 - 3000;
        let ty = Math.random() * 6000 - 3000;
        let tz = Math.random() * 6000 - 3000;
        oLi.style.transform = `translate3d(${tx}px,${ty}px,${tz}px)`;

        oUl.appendChild(oLi)
    }

    setTimeout(Grid, 0)
})();

//拖拽
(function () {
    let rotateX = 0,
        rotateY = 0,
        tslateZ = -2000;

    //文字不能选中
    document.onselectstart = function () {
        return false
    }

    document.onmousedown = function (ev) {
        let lastX = ev.clientX,
            lastY = ev.clientY,
            x = y = 0;

        let ifMove = false;
        let ifTime = new Date();


        document.onmousemove = function (ev) {
            ifMove = true;

            x = ev.clientX - lastX;
            y = ev.clientY - lastY;
            rotateX -= y / 10;
            rotateY += x / 10;
            oUl.style.transform = `translateZ(${tslateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
            lastX = ev.clientX;
            lastY = ev.clientY;
        }

        this.onmouseup = function (ev) {
            this.onmousemove = null

            if (ifMove || (new Date() - ifTime) > 500) {
                if (ev.target.nodeName === 'B')
                    ev.target.bool = true
            }

            function m() {
                x *= 0.9;
                y *= 0.9;
                rotateX -= y / 10;
                rotateY += x / 10;
                oUl.style.transform = `translateZ(${tslateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
                if (Math.abs(x) <= 0.5 && Math.abs(y) <= 0.5) return
                requestAnimationFrame(m);
            }

            requestAnimationFrame(m);
        }
    }

    //滚轮
    function scroll() {
        if (document.onmousewheel === undefined) {
            document.addEventListener("DOMMouseScroll", function (ev) {
                let d = -ev.detail / 3;
                tslateZ += d * 100;
                oUl.style.transform = `translateZ(${tslateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }, false)
        } else {
            document.onmousewheel = function (ev) {
                let d = ev.wheelDelta / 120;
                tslateZ += d * 100;
                oUl.style.transform = `translateZ(${tslateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        }
    }

    scroll()
})();

// 弹窗
(function () {
    let oAlert = document.querySelector('#alert'),
        oTitle = document.querySelector("#alert .title span"),
        oImg = document.querySelector("#alert .img img"),
        oAuthor = document.querySelector("#alert .author span"),
        oInfo = document.querySelector("#alert .info span");

    let oAll = document.getElementById("all"),
        oFrame = document.getElementById('frame'),
        oBack = document.getElementById("back");

    oUl.onclick = function (ev) {
        if (ev.target.nodeName === 'B') {
            if (ev.target.bool) {
                ev.target.bool = false
            } else {
                if (oAlert.style.display === 'block') {
                    hide();
                } else {
                    let index = ev.target.parentNode.index;
                    let data = flyData[index % flyData.length];

                    oAlert.src = data.src;

                    oTitle.innerHTML = `课题: ${data.title}`;
                    oImg.src = `./src/${data.src}/index.png`;
                    oAuthor.innerHTML = `主讲：${data.author}`;
                    oInfo.innerHTML = `描述：${data.desc}`;
                    show();
                }
            }
        }
        ev.cancelBubble = true
    }

    //点击页面任何位置都隐藏
    document.onclick = function () {
        hide();
    }

    oAlert.onclick = function (ev) {
        ev.cancelBubble = true;

        oAll.className = 'left';
        oFrame.src = `./src/${this.src}/index.html`
    }

    oBack.onclick = function () {
        oAll.className = '';
    }

    function show() {
        oAlert.style.display = 'block';

        oAlert.style.transform = 'rotateY(0deg) scale(2)';
        oAlert.style.opacity = 0;

        setTimeout(function () {
            oAlert.style.transform = `rotateY(0deg) scale(1)`;
            oAlert.style.opacity = 1;
        }, 0)
    }


    function hide() {
        if (oAlert.style.display == 'block') {
            oAlert.style.transform = `rotateY(180deg) scale(0)`;
            oAlert.style.opacity = 0;

            setTimeout(function () {
                oAlert.style.display = 'none';
            }, 500)
        }

    }
})();

// 按钮
(function () {
    let oBtn = document.querySelectorAll("#btn>ul>li");

    oBtn[0].onclick = Table;
    oBtn[1].onclick = Sphere;
    oBtn[2].onclick = Helix;
    oBtn[3].onclick = Grid;
})();

function Helix() {
    let h = Math.round(len / 4);
    let disY = 7;
    let disX = 360 / h;
    let mid = len / 2;

    for (let i = 0; i < len; i++) {
        aLi[i].style.transform = `rotateY(${i * disX}deg) translateY(${(i - mid) * disY}px) translateZ(800px)`;
    }
}

function Sphere() {
    // var arr = [1, 3, 7, 9, 11, 14, 21, 20, 12, 10, 9, 7, 1];
    let arr = [1, 5, 8, 10, 11, 17, 21, 17, 11, 10, 8, 5, 1];
    let x, y;
    for (let i = 0; i < len; i++) {
        let numC, nmuG,
            num = 0;

        for (let j = 0; j < arr.length; j++) {
            num += arr[j];
            if (i < num) {
                numC = j;
                nmuG = i - (num - arr[j]);
                break;
            }
        }
        x = 90 - (180 / (arr.length - 1)) * numC;
        y = (360 / arr[numC]) * (nmuG + 1.2);
        aLi[i].style.transform = `rotateY(${y}deg) rotateX(${x}deg) translateZ(800px)`
    }
}

function Table() {
    let disX = 170,
        disY = 210,
        x, y;

    let arr = [
        { x: 0, y: 0, },
        { x: 17, y: 0, },
        { x: 0, y: 1, },
        { x: 1, y: 1, },
        { x: 12, y: 1, },
        { x: 13, y: 1, },
        { x: 14, y: 1, },
        { x: 15, y: 1, },
        { x: 16, y: 1, },
        { x: 17, y: 1, },
        { x: 0, y: 2, },
        { x: 1, y: 2, },
        { x: 12, y: 2, },
        { x: 13, y: 2, },
        { x: 14, y: 2, },
        { x: 15, y: 2, },
        { x: 16, y: 2, },
        { x: 17, y: 2, },
    ]
    for (let i = 0; i < len; i++) {
        let oLi = aLi[i];
        if (i < 18) {
            x = arr[i].x - 8.9;
            y = arr[i].y - 4;
        } else {
            x = i % 18 - 8.9;
            y = Math.floor(i / 18) - 2;
        }
        x *= disX;
        y *= disY;
        oLi.style.transform = `translate3d(${x}px,${y}px,0px)`;
    }
}

function Grid() {
    let disX = 350, disY = 350, disZ = 800;
    for (let i = 0; i < len; i++) {
        let oLi = aLi[i];

        let x = (oLi.x - 2) * disX,
            y = (oLi.y - 2) * disY,
            z = -(oLi.z - 2) * disZ;

        oLi.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    }
}