$(function() {

    $("#previewWatermark").on("click", function() {
        var canvas = document.getElementById('watermarkCanvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        context.font = $("#fontSize").val() + "px " + $("#fontStyle").val();
        context.fillStyle = $("#fontColor").val();
        var watermarkText = $("#watermark").val();

        var textWidth = context.measureText(watermarkText).width;
        var textHeight = parseInt($("#fontSize").val(), 10);

        // Draw the visible watermark
        for (var x = 0; x < canvas.width; x += textWidth + 20) {
            for (var y = 0; y < canvas.height; y += textHeight + 20) {
                context.fillText(watermarkText, x, y);
            }
        }

        // Draw the invisible watermark (transparent)
        context.globalAlpha = 0.1; // Set transparency for the watermark
        for (var x = 0; x < canvas.width; x += textWidth + 20) {
            for (var y = 0; y < canvas.height; y += textHeight + 20) {
                context.fillText(watermarkText, x + 10, y + 10); // Offset for comparison
            }
        }
        context.globalAlpha = 1; // Reset alpha

        $("#applyWatermark").removeClass("hidden");
    });

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

});
