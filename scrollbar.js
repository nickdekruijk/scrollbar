// v1.2

function scrollTo(element, to, duration) {
    var start = element.scrollLeft,
        change = to - start,
        currentTime = 0,
        increment = 5;

    var animateScroll = function () {
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollLeft = val;
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};

document.querySelectorAll('.scrollbar-x + .scroll-buttons > .scroll-button').forEach(function (el) {
    el.addEventListener('click', function (e) {
        var direction = this.classList.contains('scroll-button-next') ? 3 : -3;
        var scroll = this.parentElement.previousElementSibling;
        var current = 1;
        var items = scroll.children[0].children;
        for (n in items) {
            if (items[n].offsetLeft <= scroll.scrollLeft) current = n;
        }
        let goto = Math.round(current) + direction;
        if (goto < 0) {
            goto = 0;
        }
        scrollTo(scroll, items[goto].offsetLeft, 250);
    });
});

document.querySelectorAll('.scrollbar-x').forEach(function (el) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let preventLinks = true;

    el.querySelectorAll('A[href]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            if (preventLinks) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });
    });

    el.addEventListener('scroll', function (e) {
        if (el.scrollLeft <= 0) {
            el.nextElementSibling.querySelector('.scroll-button-prev').classList.add('hide');
        } else {
            el.nextElementSibling.querySelector('.scroll-button-prev').classList.remove('hide');
        }
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
            el.nextElementSibling.querySelector('.scroll-button-next').classList.add('hide');
        } else {
            el.nextElementSibling.querySelector('.scroll-button-next').classList.remove('hide');
        }
    });
    el.dispatchEvent(new Event('scroll'));

    el.addEventListener('mousedown', function (e) {
        isDown = true;
        el.classList.add('dragging');
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
    });
    el.addEventListener('mouseleave', function (e) {
        isDown = false;
        el.classList.remove('dragging');
    });
    el.addEventListener('mouseup', function (e) {
        isDown = false;
        preventLinks = (startX - (e.pageX - el.offsetLeft));
        e.preventDefault();
        el.classList.remove('dragging');
    });
    el.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 1; //scroll-fast
        el.scrollLeft = scrollLeft - walk;
    });
});
