

function ReadTextFile(fileName, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', fileName);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            let text = request.responseText.trim() + "\n";
            let posA = 0;
            let posB = text.indexOf("\n", 0);
            let startLinePosition = 0;
            let endLinePosition = text.indexOf("\n", 0);
            let vArray = [];
            let fArray = [];
            let lineItems = [];
    
            while (startLinePosition < endLinePosition) {
                let line = text.substring(startLinePosition, endLinePosition);
                switch (line.charAt(0)) {
                    case "v":
                        lineItems = line.split(" ");
                        switch (line.charAt(1)) {
                            case " ": 
                                vArray.push(new Vector3(parseFloat(lineItems[1]), parseFloat(lineItems[2]), parseFloat(lineItems[3])));
                                break;
                        }
                        break;
                    case "f":
                        lineItems = line.split(" ");
                        let point1Array = lineItems[1].split("/");
                        let point2Array = lineItems[2].split("/");
                        let point3Array = lineItems[3].split("/");
                        fArray.push(new Triangle(parseFloat(point1Array[0]), parseFloat(point2Array[0]), parseFloat(point3Array[0])));
                        break;
                }
                startLinePosition = endLinePosition + 1;
                endLinePosition = text.indexOf("\n", startLinePosition);
            }
            callback(vArray, fArray);
        }
    }
    request.send();
}

function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function Triangle(vertex1, vertex2, vertex3) {
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.vertex3 = vertex3;
}