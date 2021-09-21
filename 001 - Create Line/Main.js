let drawer = new Drawer("MyCanvas", 100, 100, 8);
drawer.SetColor(30, 30, 30);
drawer.Clear();
drawer.SetColor(200, 0, 0);
drawer.AddPoint(0, 0);
drawer.SetColor(0, 200, 0);
drawer.AddPoint(99, 0);
drawer.SetColor(0, 0, 200);
drawer.AddPoint(0, 99);
let t0 = performance.now();
for (let i = 0; i < 10000; i++) {
    AddLine(0, 0, 99, 99);
}
let t1 = performance.now();
console.log("Call AddLine took " + (t1 - t0) + " ms.");
drawer.Show();

function AddLine(x0, y0, x1, y1) {
    let isInvert = false;
    if (Math.abs(y1 - y0) > Math.abs(x1 - x0)) {
        [x0, y0] = [y0, x0];
        [x1, y1] = [y1, x1];
        isInvert = true;
    }

    if (x0 > x1) {
        [x0, x1] = [x1, x0];
        [y0, y1] = [y1, y0];
    }

    let xLength = x1 - x0;
    let yLength = Math.abs(y1 - y0);
    let stepY = 2 * yLength;
    let deltaY = 0;
    let y = y0;
    let dy = y1 > y0 ? 1 : -1;
    let doubleXLendth = 2 * xLength;

    for (let x = x0; x <= x1; x++) {
        if (!isInvert) {
            drawer.AddPoint(x, y);
        }
        else {
            drawer.AddPoint(y, x);
        }

        deltaY += stepY;
        if (deltaY > xLength) {
            y += dy;
            deltaY -= doubleXLendth;
        }
    }
}