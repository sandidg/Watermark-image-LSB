$.fn.img2blob = function(a, callback) {
    var b = {
        watermark: '',
        fontStyle: 'Arial',
        fontSize: '30',
        fontColor: 'black'
    };
    if (typeof a === 'object') {
        a.watermark = (a.watermark == undefined ? b.watermark : a.watermark);
        a.fontStyle = (a.fontStyle == undefined ? b.fontStyle : a.fontStyle);
        a.fontSize = (a.fontSize == undefined ? b.fontSize : a.fontSize);
        a.fontColor = (a.fontColor == undefined ? b.fontColor : a.fontColor);
    } else {
        a = b;
    }

    var images = []; // Array to hold two versions of the image

    $(this).each(function(i, c) {
        var d = $(this).attr('src'),
            e = this,
            f = new Image();
        f.onload = function() {
            var g = document.createElement('canvas');
            g.width = f.naturalWidth;
            g.height = f.naturalHeight;
            var h = g.getContext('2d');
            h.drawImage(f, 0, 0);
            if (a.watermark != '') {
                h.font = a.fontSize + 'px ' + a.fontStyle;
                h.fillStyle = a.fontColor;
                h.globalAlpha = 0.1; // Setting transparency for the watermark

                var textWidth = h.measureText(a.watermark).width;
                var textHeight = parseInt(a.fontSize, 10);
                
                // Draw the visible watermark
                for (var x = 0; x < g.width; x += textWidth + 20) {
                    for (var y = 0; y < g.height; y += textHeight + 20) {
                        h.fillText(a.watermark, x, y);
                    }
                }

                // Create a new canvas for the invisible watermark
                var g2 = document.createElement('canvas');
                g2.width = f.naturalWidth;
                g2.height = f.naturalHeight;
                var h2 = g2.getContext('2d');
                h2.drawImage(f, 0, 0);

                // Draw the invisible watermark (transparent)
                h2.globalAlpha = 0; // Set alpha to 0 for invisible watermark
                for (var x = 0; x < g2.width; x += textWidth + 20) {
                    for (var y = 0; y < g2.height; y += textHeight + 20) {
                        h2.fillText(a.watermark, x, y);
                    }
                }
                
                var j = g.toDataURL('image/png');
                var j2 = g2.toDataURL('image/png');
                images.push(j); // Push both versions of the image into the array
                images.push(j2);
            } else {
                var j = g.toDataURL('image/png');
                images.push(j); // Push the image without watermark into the array
            }
            
            if (images.length === $(this).length * 2) {
                callback(images); // Once all images are processed, call the callback function with the array of images
            }
        };
        f.src = d;
    });
}

// Usage:
$("#applyWatermark").on("click", function() {
    var file = $("#imageUpload")[0].files[0];
    if (!file) {
        alert("Please upload an image first.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        $("#preview").attr("src", e.target.result).img2blob({
            watermark: $("#watermark").val(),
            fontStyle: $("#fontStyle").val(),
            fontSize: $("#fontSize").val(),
            fontColor: $("#fontColor").val()
        }, function(images) {
            // After watermarking, set both versions of the image
            $("#watermarkedImage1").attr("src", images[0]); // Image with visible watermark
            $("#watermarkedImage2").attr("src", images[1]); // Image with invisible watermark
            $("#confirmation").removeClass("hidden");
        });
    };
    reader.readAsDataURL(file);
});
