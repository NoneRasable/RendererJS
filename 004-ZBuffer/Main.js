const WIDTH = 800;
const HEIGHT = 800;
const ZOOM = 1;
const IS_READ_FILE = 1;
const IS_ANIM = 1;

let vArrayAnim;
let fArrayAnim;
let alpha = 0;
let colors = [];

let zBuffer = new Array(WIDTH * HEIGHT);
ClearZBuffer();

const drawer = new Drawer("MyCanvas", WIDTH, HEIGHT, ZOOM);
//let t0 = performance.now();
//let t1 = performance.now();
//console.log("Call AddLine took " + (t1 - t0) + " ms.");

if (IS_READ_FILE > 0) {
    ReadTextFile("dog.obj", DrawObject);
}
else {
    drawer.SetColor(30, 30, 30);
    drawer.Clear();
    drawer.SetColor(200, 0, 0);
    let a = new Vector3(100, 100, 0);
    let b = new Vector3(700, 200, 0);
    let c = new Vector3(400, 600, 0);

    let t0 = performance.now();
    for (let index = 0; index < 1000; index++) {
        FillTriangleBary(a, b, c);        
    }    
    let t1 = performance.now();
    
    let t2 = performance.now();
    for (let index = 0; index < 1000; index++) {
        FillTriangle(a, b, c);        
    }
    let t3 = performance.now();

    console.log("Call FillTriangleBary took " + (t1 - t0) + " ms.");
    console.log("Call FillTriangle took " + (t3 - t2) + " ms.");
    drawer.SetColor(200, 200, 0);
    AddTriangle(a.x, a.y, b.x, b.y, c.x, c.y);
    drawer.Show();
}

function ClearZBuffer() {
    for (let index = 0; index < zBuffer.length; index++) {
        zBuffer[index] = -Infinity;        
    }
}

function DrawObject(vArray, fArray) {
    vArrayAnim = vArray;
    fArrayAnim = fArray;
    for (let i = 0; i < fArrayAnim.length; i++) {
        colors.push(new Color(GetRandomInteger(255), GetRandomInteger(255), GetRandomInteger(255)));
    }

    if (IS_ANIM) {
        drawer.SetUpdate(Update);
        drawer.SetFpsLimit(30);
        drawer.StartAnimating();
    }
    else {
        Update();
    }
}

function Update() {
    ClearZBuffer();
    drawer.SetColor(30, 30, 30);
    drawer.Clear();
    drawer.SetColor(200, 0, 0);

    for (let index = 0; index < fArrayAnim.length; index++) {
        let triangle = fArrayAnim[index];
        let point1 = YRotate(vArrayAnim[triangle.vertex1 - 1], alpha);
        let point2 = YRotate(vArrayAnim[triangle.vertex2 - 1], alpha);
        let point3 = YRotate(vArrayAnim[triangle.vertex3 - 1], alpha);

        let dx = WIDTH / 2;
        let dy = HEIGHT / 2;
        let objZoom = 200;

        let x0 = Math.round(point1.x * objZoom + dx);
        let y0 = Math.round(point1.y * objZoom + dy);
        let z0 = Math.round(point1.z * objZoom);
        let x1 = Math.round(point2.x * objZoom + dx);
        let y1 = Math.round(point2.y * objZoom + dy);
        let z1 = Math.round(point2.z * objZoom);
        let x2 = Math.round(point3.x * objZoom + dx);
        let y2 = Math.round(point3.y * objZoom + dy);
        let z2 = Math.round(point3.z * objZoom);

        let vec1 = new Vector3(point2.x - point1.x, point2.y - point1.y, point2.z - point1.z);
        let vec2 = new Vector3(point3.x - point1.x, point3.y - point1.y, point3.z - point1.z);
        let n = VecCross(vec1, vec2);
        n = Normalize(n);
        let minusLightDir = new Vector3(0, 0, 1);
        let intensity = VecDot(n, minusLightDir);
        if (intensity > 0) {
            drawer.SetColor(intensity * 255, intensity * 255, intensity * 255);
            let a = new Vector3(x0, y0, z0);
            let b = new Vector3(x1, y1, z1);
            let c = new Vector3(x2, y2, z2);
            FillTriangle(a, b, c);
        }        
    }

    drawer.Show();

    alpha += Math.PI / 180;
    if (alpha > 2 * Math.PI) {
        alpha = 0;
    }
}

function Barycentric(a, b, c, p) {
    let ab = new Vector3(b.x - a.x, b.y - a.y, b.z - a.z);
    let ac = new Vector3(c.x - a.x, c.y - a.y, c.z - a.z);
    let pa = new Vector3(a.x - p.x, a.y - p.y, a.z - p.z);

    let v1 = new Vector3(ab.x, ac.x, pa.x);
    let v2 = new Vector3(ab.y, ac.y, pa.y);
    let v3 = VecCross(v1, v2);
    if (v3.z == 0) {
        return null;
    }
    let u = v3.x / v3.z;
    let v = v3.y / v3.z;
    return [1 - u - v, u, v];
}

function VecDot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function VecCross(v1, v2) {
    return new Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
}

function Normalize(v) {
    let length = VLength(v);
    if (length == 0) {
        return new Vector3();
    }
    return new Vector3(v.x / length, v.y / length, v.z / length);
}

function VLength(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function GetRandomInteger(max) {
    return Math.floor(Math.random() * (max + 1));
}

function YRotate(vector, alpha) {
    let matrix = [[Math.cos(alpha), 0, Math.sin(alpha)], 
                  [0, 1, 0], 
                  [-Math.sin(alpha), 0, Math.cos(alpha)]];
    return ProductMV(matrix, vector);
}

function ProductMV(matrix, vector) {
    let row1 = matrix[0]
    let row2 = matrix[1]
    let row3 = matrix[2]
    let newVector = new Vector3(0, 0, 0);
    newVector.x = row1[0] * vector.x + row1[1] * vector.y + row1[2] * vector.z;
    newVector.y = row2[0] * vector.x + row2[1] * vector.y + row2[2] * vector.z;
    newVector.z = row3[0] * vector.x + row3[1] * vector.y + row3[2] * vector.z;
    return newVector;
}

function AddTriangle(x0, y0, x1, y1, x2, y2) {
    AddLine(x0, y0, x1, y1);
    AddLine(x1, y1, x2, y2);
    AddLine(x2, y2, x0, y0);
}

function FillTriangle(a, b, c) {
    let x0 = a.x;
    let x1 = b.x;
    let x2 = c.x;
    let y0 = a.y;
    let y1 = b.y;
    let y2 = c.y;
    if (x0 == x1 && x0 == x2) {
        return;
    }
    if (y0 == y1 && y0 == y2) {
        return;
    }
    if (y1 < y0) {
        [x0, x1] = [x1, x0];
        [y0, y1] = [y1, y0];
    }
    if (y2 < y0) {
        [x0, x2] = [x2, x0];
        [y0, y2] = [y2, y0];
    }
    if (y2 < y1) {
        [x1, x2] = [x2, x1];
        [y1, y2] = [y2, y1];
    }

    let ctgA = (x2 - x0) / (y2 - y0);
    let ctgB = y1 != y0 ? (x1 - x0) / (y1 - y0) : 0;
    let ctgC = y2 != y1 ? (x2 - x1) / (y2 - y1) : 0;

    let xA = x0;
    let xB = x0;
    let xC = x1;
    let xFrom, xTo;
    for (let y = y0;; y++) {
        xFrom = Math.round(xA);
        xTo = y < y1 ? Math.round(xB) : Math.round(xC);
        if (xTo < xFrom) {
            [xFrom, xTo] = [xTo, xFrom];
        }
        for (let x = xFrom; x <= xTo; x++) {
            let bary = Barycentric(a, b, c, new Vector3(x, y, 0));
            if (bary == null) {
                continue;
            }
            let pz = a.z * bary[0] + b.z * bary[1] + c.z * bary[2];
            let index = y * WIDTH + x;
            if (pz > zBuffer[index]) {
                drawer.AddPoint(x, y);
                zBuffer[index] = pz;
            }        
        }

        if (y >= y2) {
            break;
        }

        xA += ctgA;
        if (y < y1) {
            xB += ctgB;
        }
        else {
            xC += ctgC;
        }
    }
}

function FillTriangleBary(a, b, c) {
    let minX = Math.min(a.x, b.x, c.x);
    let maxX = Math.max(a.x, b.x, c.x);
    let minY = Math.min(a.y, b.y, c.y);
    let maxY = Math.max(a.y, b.y, c.y);

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            let bary = Barycentric(a, b, c, new Vector3(x, y, 0));
            if (bary[0] > 0 && bary[1] > 0 && bary[2] > 0) {
                drawer.AddPoint(x, y);
            }            
        }
    }
}

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