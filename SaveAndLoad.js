function SaveAndLoad()
{
	this.x = 100;
	this.y = 200;
	this.width = canvas.width - this.x * 2;
	this.height = 200;

	this.background = new createjs.Shape();
	this.background.name = "saveandload background1";
	this.background.graphics.beginFill("#0006").drawRect(0, 0, canvas.width, canvas.height);

	this.shape = new createjs.Shape();
	this.shape.name = "saveandload background2";
	this.shape.graphics.setStrokeStyle(3).beginStroke("#9ab").beginFill("#678").drawRect(this.x, this.y, this.width, this.height);

	if (!/MSIE|Trident/.test(window.navigator.userAgent))
		stage.addChild(this.background);

	stage.addChild(this.shape);

	this.close = new Button(text.get("ie_c"), this.x + this.width - 60, this.y + this.height - 35, 80, "#ace");
	this.close.label.on("click", function(event)
	{
		editor.saveAndLoad.kill();
	});

	this.saveButton = new Button(text.get("ie_e"), canvas.width / 2, this.y + 25, 80, "#ace");
	this.saveButton.label.on("click", function(event)
	{
		editor.fullCode.attacks[editor.selection] = editor.readData();
		editor.saveAndLoad.errorText.text = "";
		editor.saveAndLoad.codeField.value = JSON.stringify(editor.fullCode);
	});

	this.loadButton = new Button(text.get("ie_i"), canvas.width / 2, this.y + this.height - 35, 80, "#ace");
	this.loadButton.label.on("click", function(event)
	{
		if (editor.saveAndLoad.codeField.value.length > 0)
		{
			editor.selection = 0;
			editor.saveAndLoad.errorText.text = "";

			try
			{
				var code = JSON.parse(editor.saveAndLoad.codeField.value);

				checkJSON(code);
				editor.fullCode = code;
				editor.writeData(true);

				editor.saveAndLoad.close.forceClick();
			}
			catch (e)
			{
				if (debugMode)
					console.log(e);

				editor.saveAndLoad.errorText.text = e;
			}
		}
	});

	this.arrow1 = new createjs.Bitmap(loader.getResult("arrow"));
	this.arrow1.name = "saveandload arrow1";
	this.arrow1.x = canvas.width / 2;
	this.arrow1.y = this.y + 65;
	this.arrow1.regX = 15;
	this.arrow1.regY = 15;

	this.arrow2 = new createjs.Bitmap(loader.getResult("arrow"));
	this.arrow2.name = "saveandload arrow2";
	this.arrow2.x = canvas.width / 2;
	this.arrow2.y = this.y + 140;
	this.arrow2.regX = 15;
	this.arrow2.regY = 15;

	this.errorText = new createjs.Text("", fontCode, "#fff");
	this.errorText.name = "text errortext";
	this.errorText.x = canvas.width / 2;
	this.errorText.y = this.y + 115;
	this.errorText.textAlign = "center";
	this.errorText.scaleX = 0.8;

	stage.addChild(this.arrow1, this.arrow2, this.errorText);

	this.codeField = document.createElement("input");
	this.codeField.id = "saveload_input";
	this.codeField.type = "text";
	this.codeField.style.display = "block";
	this.codeField.style.position = "absolute";
	this.codeField.style.left = (canvas.offsetLeft + this.x + 50) + "px";
	this.codeField.style.top = (canvas.offsetTop + this.y + 90) + "px";
	this.codeField.style.width = "296px";
	this.codeField.style.color = "rgb(192, 240, 208)";
	this.codeField.style.backgroundColor = "rgb(16, 48, 64)";
	this.codeField.style.font = fontCode;

	document.body.appendChild(this.codeField);

	for (var f = 0; f < editor.fields.length; f++)
	{
		var fieldX = document.getElementById(editor.fields[f]).style.left.replace("px", "") - canvas.offsetLeft;
		var fieldY = document.getElementById(editor.fields[f]).style.top.replace("px", "") - canvas.offsetTop;

		if (fieldX > this.x - 25 && fieldX < this.x + this.width && fieldY > this.y - 25 && fieldY < this.y + this.height)
			document.getElementById(editor.fields[f]).style.display = "none";
	}
}

SaveAndLoad.prototype.kill = function()
{
	this.close.kill();
	this.saveButton.kill();
	this.loadButton.kill();
	document.body.removeChild(this.codeField);
	stage.removeChild(this.background);
	stage.removeChild(this.shape, this.arrow1, this.arrow2, this.errorText);

	var fieldsList = ["", editor.page1fields, editor.page2fields, editor.page3fields, editor.page4fields][editor.tab];

	for (var f = 0; f < fieldsList.length; f++)
		fieldsList[f].style.display = "block";

	editor.attacksList.style.display = "block";
	editor.saveAndLoad = undefined;
}

SaveAndLoad.prototype.toString = function()
{
	return "SaveAndLoad";
}