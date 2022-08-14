function Editor()
{
	editor = this;
	activity = 3;

	this.tab = 1;
	this.colorNames = ["", "default", "red", "orange", "yellow", "green", "cyan", "blue", "indigo", "purple", "pink", "white", "grey"];
	this.soundNames = ["default", "none", "slow bullet", "medium bullet", "fast bullet", "explosion", "laser beam", "laser bullet", "launcher", "drop", "missile", "shock", "fire", "magic", "sonic wave"];
	this.moveNames = ["none", "go top center", "go center", "stay above player", "chase player", "go left-right"];
	this.selection = 0;
	this.count = 0;
	this.helpFrames = 0;
	this.fullCode = JSON.parse('{"attacks":[]}');
	this.oldId = "";

	// commun
	this.shape1 = new createjs.Shape();
	this.shape1.name = "editor background1";
	this.shape1.graphics.beginFill("#678").drawRect(0, 0, canvas.width, 50);
	this.shape2 = new createjs.Shape();
	this.shape2.name = "editor background2";
	this.shape2.graphics.beginFill("#345").drawRect(0, 50, canvas.width, canvas.height);
	this.shape3 = new createjs.Shape();
	this.shape3.name = "editor background3";
	this.shape3.graphics.beginFill("#678").drawRect(0, canvas.height - 50, canvas.width, 50);
	this.shape4 = new createjs.Shape();
	this.shape4.name = "editor background4";
	this.shape4.graphics.beginFill("#567").drawRect(0, 50, canvas.width, 30);

	this.attacksText = new createjs.Text(text.get("ed_att"), font, "#fff");
	this.attacksText.name = "text attacks";
	this.attacksText.x = 20;
	this.attacksText.y = 20;

	this.attacksList = document.createElement("select");
	this.attacksList.id = "attacks_list";
	this.attacksList.type = "text";
	this.attacksList.style.left = (canvas.offsetLeft + 120) + "px";
	this.attacksList.style.top = (canvas.offsetTop + 17) + "px";
	this.attacksList.addEventListener("change", function(event)
	{
		editor.fullCode.attacks[editor.selection] = editor.readData();

		var num = editor.attacksList.value.substring(1, editor.attacksList.value.indexOf(')'));
		var id = editor.attacksList.value.substring(editor.attacksList.value.indexOf(' ') + 1);

		editor.selection = num - 1;
		editor.idField.value = id != noIdText ? id : "";
		editor.oldId = editor.idField.value;
		editor.writeData(false);
	}, false);

	this.selectedTab = new createjs.Shape();
	this.selectedTab.name = "editor selectedtab";
	this.selectedTab.x = 15;
	this.selectedTab.y = 54;

	if (!/MSIE|Trident/.test(window.navigator.userAgent))
		this.selectedTab.graphics.beginFill("#fff2").drawRoundRect(0, 0, 120, 25, 5);
	else
		this.selectedTab.graphics.beginFill("#fff").drawRoundRect(0, 0, 120, 25, 5);

	stage.addChild(this.shape1, this.shape2, this.shape3, this.shape4, this.attacksText, this.selectedTab);
	document.body.appendChild(this.attacksList);

	var deleteAttack = new Button(text.get("ed_del"), canvas.width - 260, 20, 90, "#ace");

	deleteAttack.label.on("click", function(event)
	{
		if (editor.saveAndLoad != undefined || activity == 2)
			return;

		editor.fullCode.attacks.splice(editor.selection, 1);

		if (editor.selection > 0)
			editor.selection--;

		if (editor.fullCode.attacks.length == 0)
			editor.newAttack.forceClick();

		editor.writeData(true);
	});

	this.newAttack = new Button(text.get("ed_new"), canvas.width - 160, 20, 90, "#ace");
	this.newAttack.label.on("click", function(event)
	{
		if (editor.saveAndLoad != undefined || activity == 2)
			return;

		if (editor.fullCode.attacks.length > 0)
			editor.fullCode.attacks[editor.selection] = editor.readData();

		editor.fullCode.attacks.push({});
		editor.writeData(true);
		editor.attacksList.value = "(" + (editor.fullCode.attacks.length) + ") " + noIdText;

		if (!/MSIE|Trident/.test(window.navigator.userAgent))
			editor.attacksList.dispatchEvent(new Event("change"));
	});

	var copyAttack = new Button(text.get("ed_cop"), canvas.width - 60, 20, 90, "#ace");

	copyAttack.label.on("click", function(event)
	{
		if (editor.saveAndLoad != undefined || activity == 2)
			return;

		if (editor.fullCode.attacks.length > 0)
			editor.fullCode.attacks[editor.selection] = editor.readData();

		editor.fullCode.attacks.push(editor.fullCode.attacks[editor.selection]);
		editor.writeData(true);
		editor.attacksList.value = "(" + (editor.fullCode.attacks.length) + ") " + (editor.fullCode.attacks[editor.selection].id != undefined ? editor.fullCode.attacks[editor.selection].id : noIdText);

		if (!/MSIE|Trident/.test(window.navigator.userAgent))
			editor.attacksList.dispatchEvent(new Event("change"));

		if (editor.idField.value.length < 30)
		{
			editor.idField.value += "-";
			editor.fullCode.attacks[editor.selection].id = editor.idField.value;
			editor.loadIDLists();
		}
	});

	var page1 = new Button(text.get("ed_pg") + " 1", 75, 58, 120, "#ace");

	page1.label.on("click", function(event)
	{
		if (editor.saveAndLoad != undefined || activity == 2)
			return;

		for (var f = 0; f < editor.page1fields.length; f++)
			editor.page1fields[f].style.display = "block";
		for (var e = 0; e < editor.page1elements.length; e++)
			editor.page1elements[e].visible = true;
		for (var f = 0; f < editor.page2fields.length; f++)
			editor.page2fields[f].style.display = "none";
		for (var e = 0; e < editor.page2elements.length; e++)
			editor.page2elements[e].visible = false;
		for (var f = 0; f < editor.page3fields.length; f++)
			editor.page3fields[f].style.display = "none";
		for (var e = 0; e < editor.page3elements.length; e++)
			editor.page3elements[e].visible = false;
		for (var f = 0; f < editor.page4fields.length; f++)
			editor.page4fields[f].style.display = "none";
		for (var e = 0; e < editor.page4elements.length; e++)
			editor.page4elements[e].visible = false;

		editor.selectedTab.x = 15;
		editor.tab = 1;
		editor.imagePreview.visible = true;
	});

	var page2 = new Button(text.get("ed_pg") + " 2", 225, 58, 120, "#ace");

	page2.label.on("click", function(event)
	{
		if (editor.saveAndLoad != undefined || activity == 2)
			return;

		for (var f = 0; f < editor.page1fields.length; f++)
			editor.page1fields[f].style.display = "none";
		for (var e = 0; e < editor.page1elements.length; e++)
			editor.page1elements[e].visible = false;
		for (var f = 0; f < editor.page2fields.length; f++)
			editor.page2fields[f].style.display = "block";
		for (var e = 0; e < editor.page2elements.length; e++)
			editor.page2elements[e].visible = true;
		for (var f = 0; f < editor.page3fields.length; f++)
			editor.page3fields[f].style.display = "none";
		for (var e = 0; e < editor.page3elements.length; e++)
			editor.page3elements[e].visible = false;
		for (var f = 0; f < editor.page4fields.length; f++)
			editor.page4fields[f].style.display = "none";
		for (var e = 0; e < editor.page4elements.length; e++)
			editor.page4elements[e].visible = false;

		editor.selectedTab.x = 165;
		editor.tab = 2;
		editor.imagePreview.visible = false;
		editor.gravityAnglePreview.visible = editor.gravityAngleField.value != "";
	});

	var page3 = new Button(text.get("ed_pg") + " 3", 375, 58, 120, "#ace");

	page3.label.on("click", function(event)
	{
		if (editor.saveAndLoad != undefined || activity == 2)
			return;

		for (var f = 0; f < editor.page1fields.length; f++)
			editor.page1fields[f].style.display = "none";
		for (var e = 0; e < editor.page1elements.length; e++)
			editor.page1elements[e].visible = false;
		for (var f = 0; f < editor.page2fields.length; f++)
			editor.page2fields[f].style.display = "none";
		for (var e = 0; e < editor.page2elements.length; e++)
			editor.page2elements[e].visible = false;
		for (var f = 0; f < editor.page3fields.length; f++)
			editor.page3fields[f].style.display = "block";
		for (var e = 0; e < editor.page3elements.length; e++)
			editor.page3elements[e].visible = true;
		for (var f = 0; f < editor.page4fields.length; f++)
			editor.page4fields[f].style.display = "none";
		for (var e = 0; e < editor.page4elements.length; e++)
			editor.page4elements[e].visible = false;

		editor.selectedTab.x = 315;
		editor.tab = 3;
		editor.imagePreview.visible = false;
	});

	var page4 = new Button(text.get("ed_pg") + " 4", 525, 58, 120, "#ace");

	page4.label.on("click", function(event)
	{
		if (editor.saveAndLoad != undefined || activity == 2)
			return;

		for (var f = 0; f < editor.page1fields.length; f++)
			editor.page1fields[f].style.display = "none";
		for (var e = 0; e < editor.page1elements.length; e++)
			editor.page1elements[e].visible = false;
		for (var f = 0; f < editor.page2fields.length; f++)
			editor.page2fields[f].style.display = "none";
		for (var e = 0; e < editor.page2elements.length; e++)
			editor.page2elements[e].visible = false;
		for (var f = 0; f < editor.page3fields.length; f++)
			editor.page3fields[f].style.display = "none";
		for (var e = 0; e < editor.page3elements.length; e++)
			editor.page3elements[e].visible = false;
		for (var f = 0; f < editor.page4fields.length; f++)
			editor.page4fields[f].style.display = "block";
		for (var e = 0; e < editor.page4elements.length; e++)
			editor.page4elements[e].visible = true;

		editor.selectedTab.x = 465;
		editor.tab = 4;
		editor.imagePreview.visible = false;
	});

	// propriétés
	this.mainImage = new createjs.Bitmap(loader.getResult("cat main"));
	this.mainImage.name = "category main";
	this.mainImage.x = 20;
	this.mainImage.y = 95;

	this.mainText = new createjs.Text(text.get("ed_c_mn"), fontLarge, "#697");
	this.mainText.name = "text main";
	this.mainText.x = 110;
	this.mainText.y = 105;

	this.appearanceImage = new createjs.Bitmap(loader.getResult("cat appearance"));
	this.appearanceImage.name = "category appearance";
	this.appearanceImage.x = 20;
	this.appearanceImage.y = 305;

	this.appearanceText = new createjs.Text(text.get("ed_c_app"), fontLarge, "#697");
	this.appearanceText.name = "text appearance";
	this.appearanceText.x = 110;
	this.appearanceText.y = 315;

	this.soundImage = new createjs.Bitmap(loader.getResult("cat sound"));
	this.soundImage.name = "category sound";
	this.soundImage.x = 150;
	this.soundImage.y = 420;
	this.soundImage.hitArea = new createjs.Shape();
	this.soundImage.hitArea.graphics.beginFill("#000").drawRect(0, 0, this.soundImage.getBounds().width, this.soundImage.getBounds().height);

	this.positionImage = new createjs.Bitmap(loader.getResult("cat position"));
	this.positionImage.name = "category position";
	this.positionImage.x = 20;
	this.positionImage.y = 95;

	this.positionText = new createjs.Text(text.get("ed_c_pos"), fontLarge, "#697");
	this.positionText.name = "text position";
	this.positionText.x = 110;
	this.positionText.y = 105;

	this.movementImage = new createjs.Bitmap(loader.getResult("cat movement"));
	this.movementImage.name = "category movement";
	this.movementImage.x = 20;
	this.movementImage.y = 305;

	this.movementText = new createjs.Text(text.get("ed_c_mov"), fontLarge, "#697");
	this.movementText.name = "text movement";
	this.movementText.x = 110;
	this.movementText.y = 315;

	this.amountImage = new createjs.Bitmap(loader.getResult("cat amount"));
	this.amountImage.name = "category amount";
	this.amountImage.x = 20;
	this.amountImage.y = 95;

	this.amountText = new createjs.Text(text.get("ed_c_amo"), fontLarge, "#697");
	this.amountText.name = "text amount";
	this.amountText.x = 110;
	this.amountText.y = 105;

	this.repeatEachText = new createjs.Text(text.get("ed_rep"), font, "#fff");
	this.repeatEachText.name = "text repeateach";
	this.repeatEachText.x = 20;
	this.repeatEachText.y = 250;

	this.sequenceImage = new createjs.Bitmap(loader.getResult("cat sequence"));
	this.sequenceImage.name = "category sequence";
	this.sequenceImage.x = 20;
	this.sequenceImage.y = 95;

	this.sequenceText = new createjs.Text(text.get("ed_c_seq"), fontLarge, "#697");
	this.sequenceText.name = "text sequence";
	this.sequenceText.x = 110;
	this.sequenceText.y = 105;

	this.idText = new createjs.Text(text.get("a_id"), font, "#fff");
	this.idText.name = "text id";
	this.idText.x = 20;
	this.idText.y = 150;
	this.idText.hitArea = new createjs.Shape();
	this.idText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.idText.getMeasuredWidth() + 20, this.idText.getMeasuredHeight() + 16);
	this.idText.on("rollover", this.setHelp("id"));

	this.idField = document.createElement("input");
	this.idField.id = "id_input";
	this.idField.type = "text";
	this.idField.maxLength = 30;
	this.idField.style.left = (canvas.offsetLeft + 180) + "px";
	this.idField.style.top = (canvas.offsetTop + 147) + "px";
	this.idField.addEventListener("change", function(event)
	{
		editor.fullCode.attacks[editor.selection] = editor.readData();
		editor.loadIDLists();
		editor.attacksList.value = "(" + (editor.selection + 1) + ") " + (editor.fullCode.attacks[editor.selection].id != undefined ? editor.fullCode.attacks[editor.selection].id : noIdText);

		for (var i = 0; i < editor.fullCode.attacks.length; i++)
		{
			if (editor.fullCode.attacks[i].next_id == editor.oldId)
				editor.fullCode.attacks[i].next_id = editor.idField.value;

			if (editor.fullCode.attacks[i].next_random != undefined)
				for (var n = 0; n < editor.fullCode.attacks[i].next_random.length; n++)
					if (editor.fullCode.attacks[i].next_random[n] == editor.oldId)
						editor.fullCode.attacks[i].next_random[n] = editor.idField.value;

			if (editor.fullCode.attacks[i].trigger_id == editor.oldId)
				editor.fullCode.attacks[i].trigger_id = editor.idField.value;
		}

		editor.oldId = editor.idField.value;
	});

	this.imageChange = function(event)
	{
		if (editor.tab != 1)
			return;

		stage.removeChild(editor.imagePreview);

		editor.imagePreview = new createjs.Sprite(sheet);
		editor.imagePreview.gotoAndStop(getImageIndex(getImageId(editor.imageList.value, editor.getColorId(editor.colorList.value))));
		editor.imagePreview.name = "image preview";
		editor.imagePreview.x = 150;
		editor.imagePreview.y = 374;
		editor.imagePreview.scaleX = 0.2;
		editor.imagePreview.scaleY = 0.2;

		stage.addChild(editor.imagePreview);
	};

	this.imageText = new createjs.Text(text.get("a_img"), font, "#fff");
	this.imageText.name = "text image";
	this.imageText.x = 20;
	this.imageText.y = 360;
	this.imageText.hitArea = new createjs.Shape();
	this.imageText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.imageText.getMeasuredWidth() + 20, this.imageText.getMeasuredHeight() + 16);
	this.imageText.on("rollover", this.setHelp("img"));

	this.imageList = document.createElement("select");
	this.imageList.id = "image_list";
	this.imageList.type = "text";
	this.imageList.style.left = (canvas.offsetLeft + 180) + "px";
	this.imageList.style.top = (canvas.offsetTop + 357) + "px";
	this.imageList.addEventListener("change", this.imageChange, false);

	for (var i = 1; i <= sheetWidth; i++)
	{
		var option = document.createElement("option");

		option.text = i;
		this.imageList.add(option);
	}

	this.imagePreview = new createjs.Sprite(sheet);

	this.sizeText = new createjs.Text(text.get("a_siz"), font, "#fff");
	this.sizeText.name = "text size";
	this.sizeText.x = 320;
	this.sizeText.y = 360;
	this.sizeText.hitArea = new createjs.Shape();
	this.sizeText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.sizeText.getMeasuredWidth() + 20, this.sizeText.getMeasuredHeight() + 16);
	this.sizeText.on("rollover", this.setHelp("siz"));

	this.sizeField = document.createElement("input");
	this.sizeField.id = "size_input";
	this.sizeField.type = "number";
	this.sizeField.style.left = (canvas.offsetLeft + 480) + "px";
	this.sizeField.style.top = (canvas.offsetTop + 357) + "px";

	this.sizeRandomText = new createjs.Text(text.get("a_sir"), font, "#fff");
	this.sizeRandomText.name = "text sizerandom";
	this.sizeRandomText.x = 320;
	this.sizeRandomText.y = 390;
	this.sizeRandomText.hitArea = new createjs.Shape();
	this.sizeRandomText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.sizeRandomText.getMeasuredWidth() + 20, this.sizeRandomText.getMeasuredHeight() + 16);
	this.sizeRandomText.on("rollover", this.setHelp("sir"));

	this.sizeRandomField = document.createElement("input");
	this.sizeRandomField.id = "size_random_input";
	this.sizeRandomField.type = "number";
	this.sizeRandomField.style.left = (canvas.offsetLeft + 480) + "px";
	this.sizeRandomField.style.top = (canvas.offsetTop + 387) + "px";

	this.growthText = new createjs.Text(text.get("a_gro"), font, "#fff");
	this.growthText.name = "text growth";
	this.growthText.x = 320;
	this.growthText.y = 420;
	this.growthText.hitArea = new createjs.Shape();
	this.growthText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.growthText.getMeasuredWidth() + 20, this.growthText.getMeasuredHeight() + 16);
	this.growthText.on("rollover", this.setHelp("gro"));

	this.growthField = document.createElement("input");
	this.growthField.id = "growth_input";
	this.growthField.type = "number";
	this.growthField.style.left = (canvas.offsetLeft + 480) + "px";
	this.growthField.style.top = (canvas.offsetTop + 417) + "px";

	this.colorText = new createjs.Text(text.get("a_col"), font, "#fff");
	this.colorText.name = "text color";
	this.colorText.x = 20;
	this.colorText.y = 390;
	this.colorText.hitArea = new createjs.Shape();
	this.colorText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.colorText.getMeasuredWidth() + 20, this.colorText.getMeasuredHeight() + 16);
	this.colorText.on("rollover", this.setHelp("col"));

	this.colorList = document.createElement("select");
	this.colorList.id = "color_list";
	this.colorList.type = "text";
	this.colorList.style.left = (canvas.offsetLeft + 180) + "px";
	this.colorList.style.top = (canvas.offsetTop + 387) + "px";
	this.colorList.addEventListener("change", this.imageChange, false);

	for (var i = 1; i <= sheetHeight; i++)
	{
		var option = document.createElement("option");

		option.text = this.getColorName(i);
		this.colorList.add(option);
	}

	this.healthText = new createjs.Text(text.get("a_hea"), font, "#fff");
	this.healthText.name = "text health";
	this.healthText.x = 20;
	this.healthText.y = 180;
	this.healthText.hitArea = new createjs.Shape();
	this.healthText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.healthText.getMeasuredWidth() + 20, this.healthText.getMeasuredHeight() + 16);
	this.healthText.on("rollover", this.setHelp("hea"));

	this.healthField = document.createElement("input");
	this.healthField.id = "health_input";
	this.healthField.type = "number";
	this.healthField.style.left = (canvas.offsetLeft + 180) + "px";
	this.healthField.style.top = (canvas.offsetTop + 177) + "px";

	this.lifeText = new createjs.Text(text.get("a_lif"), font, "#fff");
	this.lifeText.name = "text life";
	this.lifeText.x = 320;
	this.lifeText.y = 180;
	this.lifeText.hitArea = new createjs.Shape();
	this.lifeText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.lifeText.getMeasuredWidth() + 20, this.lifeText.getMeasuredHeight() + 16);
	this.lifeText.on("rollover", this.setHelp("lif"));

	this.lifeField = document.createElement("input");
	this.lifeField.id = "life_input";
	this.lifeField.type = "number";
	this.lifeField.style.left = (canvas.offsetLeft + 480) + "px";
	this.lifeField.style.top = (canvas.offsetTop + 177) + "px";

	this.moveText = new createjs.Text(text.get("a_mov"), font, "#fff");
	this.moveText.name = "text move";
	this.moveText.x = 20;
	this.moveText.y = 210;
	this.moveText.hitArea = new createjs.Shape();
	this.moveText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.moveText.getMeasuredWidth() + 20, this.moveText.getMeasuredHeight() + 16);
	this.moveText.on("rollover", this.setHelp("mov"));

	this.moveList = document.createElement("select");
	this.moveList.id = "move_list";
	this.moveList.type = "text";
	this.moveList.style.left = (canvas.offsetLeft + 180) + "px";
	this.moveList.style.top = (canvas.offsetTop + 207) + "px";

	for (var i = 0; i < this.moveNames.length; i++)
	{
		var option = document.createElement("option");

		option.text = this.moveNames[i];
		this.moveList.add(option);
	}

	this.soundText = new createjs.Text(text.get("a_snd"), font, "#fff");
	this.soundText.name = "text sound";
	this.soundText.x = 20;
	this.soundText.y = 420;
	this.soundText.hitArea = new createjs.Shape();
	this.soundText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.soundText.getMeasuredWidth() + 20, this.soundText.getMeasuredHeight() + 16);
	this.soundText.on("rollover", this.setHelp("snd"));

	this.soundList = document.createElement("select");
	this.soundList.id = "sound_list";
	this.soundList.type = "text";
	this.soundList.style.left = (canvas.offsetLeft + 180) + "px";
	this.soundList.style.top = (canvas.offsetTop + 417) + "px";
	this.soundList.event = function(event)
	{
		var sound = editor.soundNames.indexOf(editor.soundList.value);

		if (sound == 1 || activity == 2)
			return;

		if (sound == 0)
		{
			sound = 2;

			if (editor.repeatTimesField.value > 0 && editor.repeatDelayField.value != "" && editor.repeatDelayField.value < 31)
				sound = 3;
			if (editor.repeatTimesField.value > 0 && editor.repeatDelayField.value != "" && editor.repeatDelayField.value < 11)
				sound = 4;
		}

		createjs.Sound.play("shot" + (sound - 1));
	};

	this.soundList.addEventListener("change", this.soundList.event, false);
	this.soundImage.on("click", this.soundList.event, false);

	for (var i = 0; i < this.soundNames.length; i++)
	{
		var option = document.createElement("option");

		option.text = this.soundNames[i];
		this.soundList.add(option);
	}

	this.speedText = new createjs.Text(text.get("a_spd"), font, "#fff");
	this.speedText.name = "text speed";
	this.speedText.x = 20;
	this.speedText.y = 360;
	this.speedText.hitArea = new createjs.Shape();
	this.speedText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.speedText.getMeasuredWidth() + 20, this.speedText.getMeasuredHeight() + 16);
	this.speedText.on("rollover", this.setHelp("spd"));

	this.speedField = document.createElement("input");
	this.speedField.id = "speed_input";
	this.speedField.type = "number";
	this.speedField.style.left = (canvas.offsetLeft + 180) + "px";
	this.speedField.style.top = (canvas.offsetTop + 357) + "px";

	this.speedRandomText = new createjs.Text(text.get("a_spr"), font, "#fff");
	this.speedRandomText.name = "text speedrandom";
	this.speedRandomText.x = 320;
	this.speedRandomText.y = 360;
	this.speedRandomText.hitArea = new createjs.Shape();
	this.speedRandomText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.speedRandomText.getMeasuredWidth() + 20, this.speedRandomText.getMeasuredHeight() + 16);
	this.speedRandomText.on("rollover", this.setHelp("spr"));

	this.speedRandomField = document.createElement("input");
	this.speedRandomField.id = "speed_random_input";
	this.speedRandomField.type = "number";
	this.speedRandomField.style.left = (canvas.offsetLeft + 480) + "px";
	this.speedRandomField.style.top = (canvas.offsetTop + 357) + "px";

	this.accelerationText = new createjs.Text(text.get("a_acc"), font, "#fff");
	this.accelerationText.name = "text acceleration";
	this.accelerationText.x = 20;
	this.accelerationText.y = 390;
	this.accelerationText.hitArea = new createjs.Shape();
	this.accelerationText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.accelerationText.getMeasuredWidth() + 20, this.accelerationText.getMeasuredHeight() + 16);
	this.accelerationText.on("rollover", this.setHelp("acc"));

	this.accelerationField = document.createElement("input");
	this.accelerationField.id = "acceleration_input";
	this.accelerationField.type = "number";
	this.accelerationField.style.left = (canvas.offsetLeft + 180) + "px";
	this.accelerationField.style.top = (canvas.offsetTop + 387) + "px";

	this.xText = new createjs.Text(text.get("a_x"), font, "#fff");
	this.xText.name = "text x";
	this.xText.x = 20;
	this.xText.y = 150;
	this.xText.hitArea = new createjs.Shape();
	this.xText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.xText.getMeasuredWidth() + 20, this.xText.getMeasuredHeight() + 16);
	this.xText.on("rollover", this.setHelp("x"));

	this.xField = document.createElement("input");
	this.xField.id = "x_input";
	this.xField.type = "number";
	this.xField.style.left = (canvas.offsetLeft + 180) + "px";
	this.xField.style.top = (canvas.offsetTop + 147) + "px";

	this.xRandomText = new createjs.Text(text.get("a_xr"), font, "#fff");
	this.xRandomText.name = "text xrandom";
	this.xRandomText.x = 320;
	this.xRandomText.y = 150;
	this.xRandomText.hitArea = new createjs.Shape();
	this.xRandomText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.xRandomText.getMeasuredWidth() + 20, this.xRandomText.getMeasuredHeight() + 16);
	this.xRandomText.on("rollover", this.setHelp("xr"));

	this.xRandomField = document.createElement("input");
	this.xRandomField.id = "x_random_input";
	this.xRandomField.type = "number";
	this.xRandomField.style.left = (canvas.offsetLeft + 480) + "px";
	this.xRandomField.style.top = (canvas.offsetTop + 147) + "px";

	this.yText = new createjs.Text(text.get("a_y"), font, "#fff");
	this.yText.name = "text y";
	this.yText.x = 20;
	this.yText.y = 180;
	this.yText.hitArea = new createjs.Shape();
	this.yText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.yText.getMeasuredWidth() + 20, this.yText.getMeasuredHeight() + 16);
	this.yText.on("rollover", this.setHelp("y"));

	this.yField = document.createElement("input");
	this.yField.id = "y_input";
	this.yField.type = "number";
	this.yField.style.left = (canvas.offsetLeft + 180) + "px";
	this.yField.style.top = (canvas.offsetTop + 177) + "px";

	this.yRandomText = new createjs.Text(text.get("a_yr"), font, "#fff");
	this.yRandomText.name = "text yrandom";
	this.yRandomText.x = 320;
	this.yRandomText.y = 180;
	this.yRandomText.hitArea = new createjs.Shape();
	this.yRandomText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.yRandomText.getMeasuredWidth() + 20, this.yRandomText.getMeasuredHeight() + 16);
	this.yRandomText.on("rollover", this.setHelp("yr"));

	this.yRandomField = document.createElement("input");
	this.yRandomField.id = "y_random_input";
	this.yRandomField.type = "number";
	this.yRandomField.style.left = (canvas.offsetLeft + 480) + "px";
	this.yRandomField.style.top = (canvas.offsetTop + 177) + "px";

	this.angleText = new createjs.Text(text.get("a_an"), font, "#fff");
	this.angleText.name = "text angle";
	this.angleText.x = 20;
	this.angleText.y = 430;
	this.angleText.hitArea = new createjs.Shape();
	this.angleText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.angleText.getMeasuredWidth() + 20, this.angleText.getMeasuredHeight() + 16);
	this.angleText.on("rollover", this.setHelp("an"));

	this.angleField = document.createElement("input");
	this.angleField.id = "angle_input";
	this.angleField.type = "number";
	this.angleField.style.left = (canvas.offsetLeft + 180) + "px";
	this.angleField.style.top = (canvas.offsetTop + 427) + "px";

	this.anglePreview = new createjs.Bitmap(loader.getResult("arrow"));
	this.anglePreview.name = "angle preview";
	this.anglePreview.x = 162;
	this.anglePreview.y = 440;
	this.anglePreview.regX = 15;
	this.anglePreview.regY = 15;

	stage.addChild(this.anglePreview);

	this.angleField.event = function(event)
	{
		if (!isNaN(editor.angleField.value))
			editor.anglePreview.rotation = -editor.angleField.value;
	};
	this.angleField.addEventListener("keyup", this.angleField.event);
	this.angleField.addEventListener("change", this.angleField.event);

	this.angleRandomText = new createjs.Text(text.get("a_anr"), font, "#fff");
	this.angleRandomText.name = "text anglerandom";
	this.angleRandomText.x = 320;
	this.angleRandomText.y = 430;
	this.angleRandomText.hitArea = new createjs.Shape();
	this.angleRandomText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.angleRandomText.getMeasuredWidth() + 20, this.angleRandomText.getMeasuredHeight() + 16);
	this.angleRandomText.on("rollover", this.setHelp("anr"));

	this.angleRandomField = document.createElement("input");
	this.angleRandomField.id = "angle_random_input";
	this.angleRandomField.type = "number";
	this.angleRandomField.style.left = (canvas.offsetLeft + 480) + "px";
	this.angleRandomField.style.top = (canvas.offsetTop + 427) + "px";

	this.numberText = new createjs.Text(text.get("a_num"), font, "#fff");
	this.numberText.name = "text number";
	this.numberText.x = 20;
	this.numberText.y = 150;
	this.numberText.hitArea = new createjs.Shape();
	this.numberText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.numberText.getMeasuredWidth() + 20, this.numberText.getMeasuredHeight() + 16);
	this.numberText.on("rollover", this.setHelp("num"));

	this.numberField = document.createElement("input");
	this.numberField.id = "number_input";
	this.numberField.type = "number";
	this.numberField.style.left = (canvas.offsetLeft + 180) + "px";
	this.numberField.style.top = (canvas.offsetTop + 147) + "px";

	this.numberField.event = function(event)
	{
		if (!isNaN(editor.angleField.value))
		{
			var color = editor.numberField.value > 1 ? "#fff" : "#777";

			editor.angleGapText.color = color;
			editor.xGapText.color = color;
			editor.yGapText.color = color;
		}
	};
	this.numberField.addEventListener("keyup", this.numberField.event);
	this.numberField.addEventListener("change", this.numberField.event);

	this.angleGapText = new createjs.Text(text.get("a_ang"), font, "#777");
	this.angleGapText.name = "text anglegap";
	this.angleGapText.x = 320;
	this.angleGapText.y = 150;
	this.angleGapText.hitArea = new createjs.Shape();
	this.angleGapText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.angleGapText.getMeasuredWidth() + 20, this.angleGapText.getMeasuredHeight() + 16);
	this.angleGapText.on("rollover", this.setHelp("ang"));

	this.angleGapField = document.createElement("input");
	this.angleGapField.id = "angle_gap_input";
	this.angleGapField.type = "number";
	this.angleGapField.style.left = (canvas.offsetLeft + 480) + "px";
	this.angleGapField.style.top = (canvas.offsetTop + 147) + "px";

	this.xGapText = new createjs.Text(text.get("a_xg"), font, "#777");
	this.xGapText.name = "text xgap";
	this.xGapText.x = 20;
	this.xGapText.y = 180;
	this.xGapText.hitArea = new createjs.Shape();
	this.xGapText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.xGapText.getMeasuredWidth() + 20, this.xGapText.getMeasuredHeight() + 16);
	this.xGapText.on("rollover", this.setHelp("xg"));

	this.xGapField = document.createElement("input");
	this.xGapField.id = "x_gap_input";
	this.xGapField.type = "number";
	this.xGapField.style.left = (canvas.offsetLeft + 180) + "px";
	this.xGapField.style.top = (canvas.offsetTop + 177) + "px";

	this.yGapText = new createjs.Text(text.get("a_yg"), font, "#777");
	this.yGapText.name = "text ygap";
	this.yGapText.x = 320;
	this.yGapText.y = 180;
	this.yGapText.hitArea = new createjs.Shape();
	this.yGapText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.yGapText.getMeasuredWidth() + 20, this.yGapText.getMeasuredHeight() + 16);
	this.yGapText.on("rollover", this.setHelp("yg"));

	this.yGapField = document.createElement("input");
	this.yGapField.id = "y_gap_input";
	this.yGapField.type = "number";
	this.yGapField.style.left = (canvas.offsetLeft + 480) + "px";
	this.yGapField.style.top = (canvas.offsetTop + 177) + "px";

	this.repeatTimesText = new createjs.Text(text.get("a_rep"), font, "#fff");
	this.repeatTimesText.name = "text repeattimes";
	this.repeatTimesText.x = 20;
	this.repeatTimesText.y = 220;
	this.repeatTimesText.hitArea = new createjs.Shape();
	this.repeatTimesText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.repeatTimesText.getMeasuredWidth() + 20, this.repeatTimesText.getMeasuredHeight() + 16);
	this.repeatTimesText.on("rollover", this.setHelp("rep"));

	this.repeatTimesField = document.createElement("input");
	this.repeatTimesField.id = "repeat_times_input";
	this.repeatTimesField.type = "number";
	this.repeatTimesField.style.left = (canvas.offsetLeft + 180) + "px";
	this.repeatTimesField.style.top = (canvas.offsetTop + 217) + "px";

	this.repeatTimesField.event = function(event)
	{
		if (!isNaN(editor.angleField.value))
		{
			var color = editor.repeatTimesField.value > 0 ? "#fff" : "#777";

			editor.repeatDelayText.color = color;
			editor.repeatAngleText.color = color;
			editor.repeatXText.color = color;
			editor.repeatYText.color = color;
			editor.repeatSizeText.color = color;
			editor.repeatSpeedText.color = color;
			editor.repeatLockText.color = color;
		}
	};
	this.repeatTimesField.addEventListener("keyup", this.repeatTimesField.event);
	this.repeatTimesField.addEventListener("change", this.repeatTimesField.event);

	this.repeatDelayText = new createjs.Text(text.get("a_rd"), font, "#777");
	this.repeatDelayText.name = "text repeatdelay";
	this.repeatDelayText.x = 320;
	this.repeatDelayText.y = 220;
	this.repeatDelayText.hitArea = new createjs.Shape();
	this.repeatDelayText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.repeatDelayText.getMeasuredWidth() + 20, this.repeatDelayText.getMeasuredHeight() + 16);
	this.repeatDelayText.on("rollover", this.setHelp("rd"));

	this.repeatDelayField = document.createElement("input");
	this.repeatDelayField.id = "repeat_delay_input";
	this.repeatDelayField.type = "number";
	this.repeatDelayField.style.left = (canvas.offsetLeft + 480) + "px";
	this.repeatDelayField.style.top = (canvas.offsetTop + 217) + "px";

	this.repeatXText = new createjs.Text(text.get("a_rx"), font, "#777");
	this.repeatXText.name = "text repeatx";
	this.repeatXText.x = 20;
	this.repeatXText.y = 280;
	this.repeatXText.hitArea = new createjs.Shape();
	this.repeatXText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.repeatXText.getMeasuredWidth() + 20, this.repeatXText.getMeasuredHeight() + 16);
	this.repeatXText.on("rollover", this.setHelp("rx"));

	this.repeatXField = document.createElement("input");
	this.repeatXField.id = "repeat_x_input";
	this.repeatXField.type = "number";
	this.repeatXField.style.left = (canvas.offsetLeft + 180) + "px";
	this.repeatXField.style.top = (canvas.offsetTop + 277) + "px";

	this.repeatYText = new createjs.Text(text.get("a_ry"), font, "#777");
	this.repeatYText.name = "text repeaty";
	this.repeatYText.x = 320;
	this.repeatYText.y = 280;
	this.repeatYText.hitArea = new createjs.Shape();
	this.repeatYText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.repeatYText.getMeasuredWidth() + 20, this.repeatYText.getMeasuredHeight() + 16);
	this.repeatYText.on("rollover", this.setHelp("ry"));

	this.repeatYField = document.createElement("input");
	this.repeatYField.id = "repeat_y_input";
	this.repeatYField.type = "number";
	this.repeatYField.style.left = (canvas.offsetLeft + 480) + "px";
	this.repeatYField.style.top = (canvas.offsetTop + 277) + "px";

	this.repeatAngleText = new createjs.Text(text.get("a_ra"), font, "#777");
	this.repeatAngleText.name = "text repeatangle";
	this.repeatAngleText.x = 20;
	this.repeatAngleText.y = 310;
	this.repeatAngleText.hitArea = new createjs.Shape();
	this.repeatAngleText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.repeatAngleText.getMeasuredWidth() + 20, this.repeatAngleText.getMeasuredHeight() + 16);
	this.repeatAngleText.on("rollover", this.setHelp("ra"));

	this.repeatAngleField = document.createElement("input");
	this.repeatAngleField.id = "repeat_angle_input";
	this.repeatAngleField.type = "number";
	this.repeatAngleField.style.left = (canvas.offsetLeft + 180) + "px";
	this.repeatAngleField.style.top = (canvas.offsetTop + 307) + "px";

	this.repeatSizeText = new createjs.Text(text.get("a_rsi"), font, "#777");
	this.repeatSizeText.name = "text repeatsize";
	this.repeatSizeText.x = 320;
	this.repeatSizeText.y = 310;
	this.repeatSizeText.hitArea = new createjs.Shape();
	this.repeatSizeText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.repeatSizeText.getMeasuredWidth() + 20, this.repeatSizeText.getMeasuredHeight() + 16);
	this.repeatSizeText.on("rollover", this.setHelp("rsi"));

	this.repeatSizeField = document.createElement("input");
	this.repeatSizeField.id = "repeat_size_input";
	this.repeatSizeField.type = "number";
	this.repeatSizeField.style.left = (canvas.offsetLeft + 480) + "px";
	this.repeatSizeField.style.top = (canvas.offsetTop + 307) + "px";

	this.repeatSpeedText = new createjs.Text(text.get("a_rsp"), font, "#777");
	this.repeatSpeedText.name = "text repeatspeed";
	this.repeatSpeedText.x = 20;
	this.repeatSpeedText.y = 340;
	this.repeatSpeedText.hitArea = new createjs.Shape();
	this.repeatSpeedText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.repeatSpeedText.getMeasuredWidth() + 20, this.repeatSpeedText.getMeasuredHeight() + 16);
	this.repeatSpeedText.on("rollover", this.setHelp("rsp"));

	this.repeatSpeedField = document.createElement("input");
	this.repeatSpeedField.id = "repeat_speed_input";
	this.repeatSpeedField.type = "number";
	this.repeatSpeedField.style.left = (canvas.offsetLeft + 180) + "px";
	this.repeatSpeedField.style.top = (canvas.offsetTop + 337) + "px";

	this.gravityAngleText = new createjs.Text(text.get("a_ga"), font, "#fff");
	this.gravityAngleText.name = "text gravityangle";
	this.gravityAngleText.x = 20;
	this.gravityAngleText.y = 460;
	this.gravityAngleText.hitArea = new createjs.Shape();
	this.gravityAngleText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.gravityAngleText.getMeasuredWidth() + 20, this.gravityAngleText.getMeasuredHeight() + 16);
	this.gravityAngleText.on("rollover", this.setHelp("ga"));

	this.gravityAngleField = document.createElement("input");
	this.gravityAngleField.id = "gravity_angle_input";
	this.gravityAngleField.type = "number";
	this.gravityAngleField.style.left = (canvas.offsetLeft + 180) + "px";
	this.gravityAngleField.style.top = (canvas.offsetTop + 457) + "px";

	this.gravityAnglePreview = new createjs.Bitmap(loader.getResult("arrow"));
	this.gravityAnglePreview.name = "gravityangle preview";
	this.gravityAnglePreview.x = 162;
	this.gravityAnglePreview.y = 470;
	this.gravityAnglePreview.regX = 15;
	this.gravityAnglePreview.regY = 15;
	this.gravityAnglePreview.visible = false;

	stage.addChild(this.gravityAnglePreview);

	this.gravityAngleField.event = function(event)
	{
		editor.gravityForceText.color = editor.gravityAngleField.value != "" ? "#fff" : "#777";

		if (editor.gravityAngleField.value != "")
		{
			editor.gravityAnglePreview.visible = true;
			editor.gravityAnglePreview.rotation = -editor.gravityAngleField.value;
		}
		else
			editor.gravityAnglePreview.visible = false;
	};
	this.gravityAngleField.addEventListener("keyup", this.gravityAngleField.event);
	this.gravityAngleField.addEventListener("change", this.gravityAngleField.event);

	this.gravityForceText = new createjs.Text(text.get("a_gf"), font, "#zzz");
	this.gravityForceText.name = "text gravityforce";
	this.gravityForceText.x = 320;
	this.gravityForceText.y = 460;
	this.gravityForceText.hitArea = new createjs.Shape();
	this.gravityForceText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.gravityForceText.getMeasuredWidth() + 20, this.gravityForceText.getMeasuredHeight() + 16);
	this.gravityForceText.on("rollover", this.setHelp("gf"));

	this.gravityForceField = document.createElement("input");
	this.gravityForceField.id = "gravity_force_input";
	this.gravityForceField.type = "number";
	this.gravityForceField.style.left = (canvas.offsetLeft + 480) + "px";
	this.gravityForceField.style.top = (canvas.offsetTop + 457) + "px";

	this.nextText = new createjs.Text(text.get("a_nxi"), font, "#fff");
	this.nextText.name = "text nextid";
	this.nextText.x = 20;
	this.nextText.y = 150;
	this.nextText.hitArea = new createjs.Shape();
	this.nextText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.nextText.getMeasuredWidth() + 20, this.nextText.getMeasuredHeight() + 16);
	this.nextText.on("rollover", this.setHelp("nxi"));

	this.nextList = document.createElement("select");
	this.nextList.id = "next_id_list";
	this.nextList.type = "text";
	this.nextList.style.left = (canvas.offsetLeft + 180) + "px";
	this.nextList.style.top = (canvas.offsetTop + 147) + "px";

	var attackOption = document.createElement("option");

	attackOption.text = noneText;
	this.nextList.add(attackOption);

	var attackOption = document.createElement("option");

	attackOption.text = "(1) " + noIdText;
	this.nextList.add(attackOption);

	this.nextDelayText = new createjs.Text(text.get("a_nxd"), font, "#777");
	this.nextDelayText.name = "text nextdelay";
	this.nextDelayText.x = 320;
	this.nextDelayText.y = 150;
	this.nextDelayText.hitArea = new createjs.Shape();
	this.nextDelayText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.nextDelayText.getMeasuredWidth() + 20, this.nextDelayText.getMeasuredHeight() + 16);
	this.nextDelayText.on("rollover", this.setHelp("nxd"));

	this.nextDelayField = document.createElement("input");
	this.nextDelayField.id = "next_delay_input";
	this.nextDelayField.type = "number";
	this.nextDelayField.style.left = (canvas.offsetLeft + 480) + "px";
	this.nextDelayField.style.top = (canvas.offsetTop + 147) + "px";

	this.nextRandomText = new createjs.Text(text.get("a_nxr"), font, "#fff");
	this.nextRandomText.name = "text nextrandom";
	this.nextRandomText.x = 20;
	this.nextRandomText.y = 180;
	this.nextRandomText.hitArea = new createjs.Shape();
	this.nextRandomText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.nextRandomText.getMeasuredWidth() + 20, this.nextRandomText.getMeasuredHeight() + 16);
	this.nextRandomText.on("rollover", this.setHelp("nxr"));

	this.nextRandomField = document.createElement("input");
	this.nextRandomField.id = "next_random_input";
	this.nextRandomField.type = "text";
	this.nextRandomField.style.left = (canvas.offsetLeft + 180) + "px";
	this.nextRandomField.style.top = (canvas.offsetTop + 177) + "px";

	this.nextHealthText = new createjs.Text(text.get("a_nxh"), font, "#fff");
	this.nextHealthText.name = "text nexthealth";
	this.nextHealthText.x = 20;
	this.nextHealthText.y = 210;
	this.nextHealthText.hitArea = new createjs.Shape();
	this.nextHealthText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.nextHealthText.getMeasuredWidth() + 20, this.nextHealthText.getMeasuredHeight() + 16);
	this.nextHealthText.on("rollover", this.setHelp("nxh"));

	this.nextHealthField = document.createElement("input");
	this.nextHealthField.id = "next_health_input";
	this.nextHealthField.type = "text";
	this.nextHealthField.style.left = (canvas.offsetLeft + 180) + "px";
	this.nextHealthField.style.top = (canvas.offsetTop + 207) + "px";

	var nextEditEvent = function(event)
	{
		editor.nextDelayText.color = editor.nextList.value != noneText || editor.nextRandomField.value != "" || editor.nextHealthField.value != "" ? "#fff" : "#777";
		editor.nextRandomText.color = editor.nextList.value == noneText ? "#fff" : "#777";
		editor.nextHealthText.color = editor.nextList.value == noneText && editor.nextRandomField.value == "" ? "#fff" : "#777";
	};
	this.nextList.addEventListener("change", nextEditEvent);
	this.nextRandomField.addEventListener("keyup", nextEditEvent);
	this.nextHealthField.addEventListener("keyup", nextEditEvent);

	this.triggerText = new createjs.Text(text.get("a_tri"), font, "#fff");
	this.triggerText.name = "text spawnid";
	this.triggerText.x = 20;
	this.triggerText.y = 250;
	this.triggerText.hitArea = new createjs.Shape();
	this.triggerText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.triggerText.getMeasuredWidth() + 20, this.triggerText.getMeasuredHeight() + 16);
	this.triggerText.on("rollover", this.setHelp("tri"));

	this.triggerList = document.createElement("select");
	this.triggerList.id = "trigger_id_list";
	this.triggerList.type = "text";
	this.triggerList.style.left = (canvas.offsetLeft + 180) + "px";
	this.triggerList.style.top = (canvas.offsetTop + 247) + "px";
	this.triggerList.addEventListener("change", function(event)
	{
		editor.triggerDelayText.color = editor.triggerList.value != noneText ? "#fff" : "#777";
	});

	this.triggerText2 = new createjs.Text(text.get("a_tri2"), font, "#fff");
	this.triggerText2.name = "text spawnid2";
	this.triggerText2.x = 20;
	this.triggerText2.y = 280;
	this.triggerText2.hitArea = new createjs.Shape();
	this.triggerText2.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.triggerText2.getMeasuredWidth() + 20, this.triggerText2.getMeasuredHeight() + 16);
	this.triggerText2.on("rollover", this.setHelp("tri"));

	this.triggerList2 = document.createElement("select");
	this.triggerList2.id = "trigger_id_2_list";
	this.triggerList2.type = "text";
	this.triggerList2.style.left = (canvas.offsetLeft + 180) + "px";
	this.triggerList2.style.top = (canvas.offsetTop + 277) + "px";
	this.triggerList2.addEventListener("change", function(event)
	{
		editor.triggerDelayText2.color = editor.triggerList2.value != noneText ? "#fff" : "#777";
	});

	var attackOption = document.createElement("option");

	attackOption.text = noneText;
	this.triggerList.add(attackOption);

	var attackOption = document.createElement("option");

	attackOption.text = "(1) " + noIdText;
	this.triggerList.add(attackOption);

	var attackOption2 = document.createElement("option");

	attackOption.text = noneText;
	this.triggerList2.add(attackOption);

	var attackOption2 = document.createElement("option");

	attackOption.text = "(1) " + noIdText;
	this.triggerList2.add(attackOption);

	this.triggerDelayText = new createjs.Text(text.get("a_trt"), font, "#fff");
	this.triggerDelayText.name = "text spawndelay";
	this.triggerDelayText.x = 320;
	this.triggerDelayText.y = 250;
	this.triggerDelayText.hitArea = new createjs.Shape();
	this.triggerDelayText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.triggerDelayText.getMeasuredWidth() + 20, this.triggerDelayText.getMeasuredHeight() + 16);
	this.triggerDelayText.on("rollover", this.setHelp("trt"));

	this.triggerDelayField = document.createElement("input");
	this.triggerDelayField.id = "trigger_delay_input";
	this.triggerDelayField.type = "number";
	this.triggerDelayField.style.left = (canvas.offsetLeft + 480) + "px";
	this.triggerDelayField.style.top = (canvas.offsetTop + 247) + "px";

	this.triggerDelayText2 = new createjs.Text(text.get("a_trt2"), font, "#fff");
	this.triggerDelayText2.name = "text spawndelay2";
	this.triggerDelayText2.x = 320;
	this.triggerDelayText2.y = 280;
	this.triggerDelayText2.hitArea = new createjs.Shape();
	this.triggerDelayText2.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.triggerDelayText2.getMeasuredWidth() + 20, this.triggerDelayText2.getMeasuredHeight() + 16);
	this.triggerDelayText2.on("rollover", this.setHelp("trt"));

	this.triggerDelayField2 = document.createElement("input");
	this.triggerDelayField2.id = "trigger_delay_2_input";
	this.triggerDelayField2.type = "number";
	this.triggerDelayField2.style.left = (canvas.offsetLeft + 480) + "px";
	this.triggerDelayField2.style.top = (canvas.offsetTop + 277) + "px";

	this.zText = new createjs.Text("Z position", font, "#fff");
	this.zText.name = "text z";
	this.zText.x = 320;
	this.zText.y = 425;
	this.zText.hitArea = new createjs.Shape();
	this.zText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.zText.getMeasuredWidth() + 20, this.zText.getMeasuredHeight() + 16);
	this.zText.on("rollover", this.setHelp("z"));

	this.startText = new createjs.Text(text.get("a_sta"), font, "#fff");
	this.startText.name = "text start";
	this.startText.x = 60;
	this.startText.y = 240;
	this.startText.hitArea = new createjs.Shape();
	this.startText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.startText.getMeasuredWidth() + 20, this.startText.getMeasuredHeight() + 16);
	this.startText.on("rollover", this.setHelp("sta"));

	this.startCheck = document.createElement("input");
	this.startCheck.id = "start_check";
	this.startCheck.type = "checkbox";
	this.startCheck.style.left = (canvas.offsetLeft + 20) + "px";
	this.startCheck.style.top = (canvas.offsetTop + 234) + "px";

	this.ghostText = new createjs.Text(text.get("a_gho"), font, "#fff");
	this.ghostText.name = "text ghost";
	this.ghostText.x = 360;
	this.ghostText.y = 240;
	this.ghostText.hitArea = new createjs.Shape();
	this.ghostText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.ghostText.getMeasuredWidth() + 20, this.ghostText.getMeasuredHeight() + 16);
	this.ghostText.on("rollover", this.setHelp("gho"));

	this.ghostCheck = document.createElement("input");
	this.ghostCheck.id = "ghost_check";
	this.ghostCheck.type = "checkbox";
	this.ghostCheck.style.left = (canvas.offsetLeft + 320) + "px";
	this.ghostCheck.style.top = (canvas.offsetTop + 234) + "px";

	this.vanishText = new createjs.Text(text.get("a_van"), font, "#fff");
	this.vanishText.name = "text vanish";
	this.vanishText.x = 60;
	this.vanishText.y = 450;
	this.vanishText.hitArea = new createjs.Shape();
	this.vanishText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.vanishText.getMeasuredWidth() + 20, this.vanishText.getMeasuredHeight() + 16);
	this.vanishText.on("rollover", this.setHelp("van"));

	this.vanishCheck = document.createElement("input");
	this.vanishCheck.id = "vanish_check";
	this.vanishCheck.type = "checkbox";
	this.vanishCheck.style.left = (canvas.offsetLeft + 20) + "px";
	this.vanishCheck.style.top = (canvas.offsetTop + 444) + "px";

	this.playerXText = new createjs.Text(text.get("a_plx"), font, "#fff");
	this.playerXText.name = "text playerx";
	this.playerXText.x = 60;
	this.playerXText.y = 210;
	this.playerXText.hitArea = new createjs.Shape();
	this.playerXText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.vanishText.getMeasuredWidth() + 20, this.vanishText.getMeasuredHeight() + 16);
	this.playerXText.on("rollover", this.setHelp("plx"));

	this.playerXCheck = document.createElement("input");
	this.playerXCheck.id = "player_x_check";
	this.playerXCheck.type = "checkbox";
	this.playerXCheck.style.left = (canvas.offsetLeft + 20) + "px";
	this.playerXCheck.style.top = (canvas.offsetTop + 204) + "px";

	this.playerYText = new createjs.Text(text.get("a_ply"), font, "#fff");
	this.playerYText.name = "text playerx";
	this.playerYText.x = 360;
	this.playerYText.y = 210;
	this.playerYText.hitArea = new createjs.Shape();
	this.playerYText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.vanishText.getMeasuredWidth() + 20, this.vanishText.getMeasuredHeight() + 16);
	this.playerYText.on("rollover", this.setHelp("ply"));

	this.playerYCheck = document.createElement("input");
	this.playerYCheck.id = "player_y_check";
	this.playerYCheck.type = "checkbox";
	this.playerYCheck.style.left = (canvas.offsetLeft + 320) + "px";
	this.playerYCheck.style.top = (canvas.offsetTop + 204) + "px";

	var disableAbsPos = function(event)
	{
		editor.absolutePositionText.color = editor.playerXCheck.checked || editor.playerYCheck.checked ? "#777" : "#fff";
	};
	this.playerXCheck.addEventListener("click", disableAbsPos);
	this.playerYCheck.addEventListener("click", disableAbsPos);

	this.absolutePositionText = new createjs.Text(text.get("a_abp"), font, "#fff");
	this.absolutePositionText.name = "text absoluteposition";
	this.absolutePositionText.x = 60;
	this.absolutePositionText.y = 240;
	this.absolutePositionText.hitArea = new createjs.Shape();
	this.absolutePositionText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.absolutePositionText.getMeasuredWidth() + 20, this.absolutePositionText.getMeasuredHeight() + 16);
	this.absolutePositionText.on("rollover", this.setHelp("abp"));

	this.absolutePositionCheck = document.createElement("input");
	this.absolutePositionCheck.id = "absolute_position_check";
	this.absolutePositionCheck.type = "checkbox";
	this.absolutePositionCheck.style.left = (canvas.offsetLeft + 20) + "px";
	this.absolutePositionCheck.style.top = (canvas.offsetTop + 234) + "px";

	this.anglePlayerText = new createjs.Text(text.get("a_anp"), font, "#fff");
	this.anglePlayerText.name = "text angleplayer";
	this.anglePlayerText.x = 60;
	this.anglePlayerText.y = 490;
	this.anglePlayerText.hitArea = new createjs.Shape();
	this.anglePlayerText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.anglePlayerText.getMeasuredWidth() + 20, this.anglePlayerText.getMeasuredHeight() + 16);
	this.anglePlayerText.on("rollover", this.setHelp("anp"));

	this.anglePlayerCheck = document.createElement("input");
	this.anglePlayerCheck.id = "angle_player_check";
	this.anglePlayerCheck.type = "checkbox";
	this.anglePlayerCheck.style.left = (canvas.offsetLeft + 20) + "px";
	this.anglePlayerCheck.style.top = (canvas.offsetTop + 484) + "px";

	this.repeatLockText = new createjs.Text(text.get("a_rel"), font, "#777");
	this.repeatLockText.name = "text repeatlock";
	this.repeatLockText.x = 60;
	this.repeatLockText.y = 370;
	this.repeatLockText.hitArea = new createjs.Shape();
	this.repeatLockText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.repeatLockText.getMeasuredWidth() + 20, this.repeatLockText.getMeasuredHeight() + 16);
	this.repeatLockText.on("rollover", this.setHelp("rel"));

	this.repeatLockCheck = document.createElement("input");
	this.repeatLockCheck.id = "repeat_lock_check";
	this.repeatLockCheck.type = "checkbox";
	this.repeatLockCheck.style.left = (canvas.offsetLeft + 20) + "px";
	this.repeatLockCheck.style.top = (canvas.offsetTop + 364) + "px";

	this.immunityText = new createjs.Text(text.get("a_imm"), font, "#fff");
	this.immunityText.name = "text immunity";
	this.immunityText.x = 60;
	this.immunityText.y = 270;
	this.immunityText.hitArea = new createjs.Shape();
	this.immunityText.hitArea.graphics.beginFill("#000").drawRect(-10, -8, this.immunityText.getMeasuredWidth() + 20, this.immunityText.getMeasuredHeight() + 16);
	this.immunityText.on("rollover", this.setHelp("imm"));

	this.immunityCheck = document.createElement("input");
	this.immunityCheck.id = "immunity_check";
	this.immunityCheck.type = "checkbox";
	this.immunityCheck.style.left = (canvas.offsetLeft + 20) + "px";
	this.immunityCheck.style.top = (canvas.offsetTop + 264) + "px";

	this.fields = ["attacks_list", "id_input", "image_list", "size_input", "size_random_input", "growth_input", "sound_list", "color_list", "health_input", "life_input", "move_list", "speed_input", "speed_random_input", "acceleration_input", "x_input", "y_input", "x_random_input", "y_random_input", "angle_input","angle_random_input", "number_input", "angle_gap_input", "x_gap_input", "y_gap_input", "repeat_times_input", "repeat_delay_input", "repeat_x_input", "repeat_y_input", "repeat_angle_input", "repeat_size_input", "repeat_speed_input", "gravity_angle_input", "gravity_force_input", "trigger_id_list", "trigger_delay_input", "trigger_id_2_list", "trigger_delay_2_input", "next_id_list", "next_random_input", "next_health_input", "next_delay_input", "start_check", "ghost_check", "vanish_check", "player_x_check", "player_y_check", "absolute_position_check", "angle_player_check", "repeat_lock_check", "immunity_check"];
	var fields2 = [this.idField, this.healthField, this.lifeField, this.moveList, this.startCheck, this.ghostCheck, this.immunityCheck, this.imageList, this.sizeField, this.colorList, this.sizeRandomField, this.soundList, this.growthField, this.vanishCheck, this.xField, this.xRandomField, this.yField, this.yRandomField, this.playerXCheck, this.playerYCheck, this.absolutePositionCheck, this.speedField, this.speedRandomField, this.accelerationField, this.angleField, this.angleRandomField, this.gravityAngleField, this.gravityForceField, this.anglePlayerCheck, this.numberField, this.angleGapField, this.xGapField, this.yGapField, this.repeatTimesField, this.repeatDelayField, this.repeatXField, this.repeatYField, this.repeatAngleField, this.repeatSizeField, this.repeatSpeedField, this.repeatLockCheck, this.nextList, this.nextDelayField, this.nextRandomField, this.nextHealthField, this.triggerList, this.triggerDelayField, this.triggerList2, this.triggerDelayField2];
	this.names = [this.idText, this.healthText, this.lifeText, this.moveText, this.startText, this.ghostText, this.immunityText, this.imageText, this.sizeText, this.colorText, this.sizeRandomText, this.growthText, this.soundText, this.vanishText, this.xText, this.xRandomText, this.yText, this.yRandomText, this.playerXText, this.playerYText, this.absolutePositionText, this.speedText, this.speedRandomText, this.accelerationText, this.angleText, this.angleRandomText, this.gravityAngleText, this.gravityForceText, this.anglePlayerText, this.numberText, this.angleGapText, this.xGapText, this.yGapText, this.repeatTimesText, this.repeatDelayText, this.repeatXText, this.repeatYText, this.repeatAngleText, this.repeatSizeText, this.repeatSpeedText, this.repeatLockText, this.nextText, this.nextDelayText, this.nextRandomText, this.nextHealthText, this.triggerText, this.triggerDelayText, this.triggerText2, this.triggerDelayText2, /*this.zText, */];
	this.categs = [this.mainImage, this.mainText, this.appearanceImage, this.soundImage, this.appearanceText, this.positionImage, this.positionText, this.movementImage, this.movementText, this.amountImage, this.amountText, this.repeatEachText, this.sequenceImage, this.sequenceText];
	this.page1fields = [this.idField, this.healthField, this.lifeField, this.moveList, this.startCheck, this.ghostCheck, this.immunityCheck, this.imageList, this.sizeField, this.colorList, this.sizeRandomField, this.soundList, this.growthField, this.vanishCheck];
	this.page1elements = [this.mainImage, this.mainText, this.appearanceImage, this.soundImage, this.appearanceText, this.idText, this.healthText, this.lifeText, this.moveText, this.startText, this.ghostText, this.immunityText, this.imageText, this.sizeText, this.colorText, this.sizeRandomText, this.soundText, this.growthText, this.vanishText];
	this.page2fields = [this.xField, this.xRandomField, this.yField, this.yRandomField, this.playerXCheck, this.playerYCheck, this.absolutePositionCheck, this.speedField, this.speedRandomField, this.accelerationField, this.angleField, this.angleRandomField, this.gravityAngleField, this.gravityForceField, this.anglePlayerCheck];
	this.page2elements = [this.positionImage, this.positionText, this.movementImage, this.movementText, this.xText, this.xRandomText, this.yText, this.yRandomText, this.playerXText, this.playerYText, this.absolutePositionText, this.speedText, this.speedRandomText, this.accelerationText, this.angleText, this.angleRandomText, this.gravityAngleText, this.gravityForceText, this.anglePlayerText, this.anglePreview, this.gravityAnglePreview];
	this.page3fields = [this.numberField, this.angleGapField, this.xGapField, this.yGapField, this.repeatTimesField, this.repeatDelayField, this.repeatXField, this.repeatYField, this.repeatAngleField, this.repeatSizeField, this.repeatSpeedField, this.repeatLockCheck];
	this.page3elements = [this.amountImage, this.amountText, this.repeatEachText, this.numberText, this.angleGapText, this.xGapText, this.yGapText, this.repeatTimesText, this.repeatDelayText, this.repeatXText, this.repeatYText, this.repeatAngleText, this.repeatSizeText, this.repeatSpeedText, this.repeatLockText];
	this.page4fields = [this.nextList, this.nextDelayField, this.nextRandomField, this.nextHealthField, this.triggerList, this.triggerDelayField, this.triggerList2, this.triggerDelayField2];
	this.page4elements = [this.sequenceImage, this.sequenceText, this.nextText, this.nextDelayText, this.nextRandomText, this.nextHealthText, this.triggerText, this.triggerDelayText, this.triggerText2, this.triggerDelayText2];

	for (var f = 0; f < fields2.length; f++)
		document.body.appendChild(fields2[f]);

	for (var f = 0; f < this.fields.length; f++)
	{
		var name = this.fields[f];
		var field = document.getElementById(name);

		field.style.display = "block";
		field.style.position = "absolute";

		var type = name.substring(name.lastIndexOf("_") + 1);

		if (type == "list" || type == "input")
		{
			var width = 100;

			if (name == "attacks_list")
				width = 160;
			if (name == "id_input" || name == "next_random_input" || name == "next_health_input")
				width = 400;

			if (type == "list")
			{
				width += 4;

				if (navigator.userAgent.indexOf("Firefox") > -1)
					width += 2;
			}

			field.style.color = "rgb(192, 240, 208)";
			field.style.backgroundColor = "rgb(16, 48, 64)";
			field.style.font = fontCode;
			field.style.width = width + "px";
		}
		if (type == "check")
		{
			field.style.width = "25px";
			field.style.height = "25px";
		}
	}

	for (var n = 0; n < this.names.length; n++)
	{
		stage.addChild(this.names[n]);

		this.names[n].on("rollout", function()
		{
			if (editor.saveAndLoad != undefined || activity == 2)
				return;

			editor.helpFrames = 0;
			editor.helpProperty = undefined;
			editor.help.text = "";

			stage.removeChild(editor.helpShape);

			var fieldsList = ["", editor.page1fields, editor.page2fields, editor.page3fields, editor.page4fields][editor.tab];

			for (var f = 0; f < fieldsList.length; f++)
				fieldsList[f].style.display = "block";
		});

		if (this.names[n].text.length > 17)
			this.names[n].scaleX = 0.8;
	}

	for (var n = 0; n < this.categs.length; n++)
		stage.addChild(this.categs[n]);

	// commun
	page1.forceClick();

	this.help = new createjs.Text("", font, "#fff");
	this.help.name = "text help";
	this.help.x = 20;
	this.help.y = canvas.height - 110;
	this.help.lineHeight = 17;

	stage.addChild(this.help);

	this.impExp = new Button(text.get("ed_ie"), 100, canvas.height - 35, 160, "#ace");
	this.impExp.label.on("click", function(event)
	{
		if (editor.saveAndLoad != undefined || activity == 2)
			return;

		editor.saveAndLoad = new SaveAndLoad();
	});

	this.test = new Button(text.get("ed_tst"), canvas.width - 300, canvas.height - 35, 160, "#ace");
	this.test.label.on("click", function(event)
	{
		if (editor.saveAndLoad != undefined || activity == 2)
			return;

		if (!editor.quit.label.visible)
			editor.quitNo.forceClick();

		for (var f = 0; f < editor.fields.length; f++)
			document.getElementById(editor.fields[f]).style.display = "none";

		editor.fullCode.attacks[editor.selection] = editor.readData();
		play(JSON.stringify(editor.fullCode));
	});

	this.quit = new Button(text.get("ed_qut"), canvas.width - 100, canvas.height - 35, 160, "#ace");
	this.quit.label.on("click", function(event)
	{
		if (editor.saveAndLoad != undefined || activity == 2)
			return;

		editor.impExp.label.visible = false;
		editor.test.label.visible = false;
		editor.quit.label.visible = false;

		editor.shape3a = new createjs.Shape();
		editor.shape3a.name = "editor background3a";
		editor.shape3a.graphics.beginFill("#678").drawRect(0, canvas.height - 50, canvas.width, 50);

		editor.quitText = new createjs.Text(text.get("ed_qut2"), font, "#fff");
		editor.quitText.name = "text quit";
		editor.quitText.x = 60;
		editor.quitText.y = canvas.height - 35;

		stage.addChild(editor.shape3a, editor.quitText);

		editor.quitYes = new Button(text.get("yes"), canvas.width - 200, canvas.height - 35, 80, "#ace");
		editor.quitYes.label.on("click", function(event)
		{
			editor.quitYes.kill();
			editor.quitNo.kill();
			stage.removeChild(editor.shape3a, editor.quitText);
			editor.kill();
		});

		editor.quitNo = new Button(text.get("no"), canvas.width - 100, canvas.height - 35, 80, "#ace");
		editor.quitNo.label.on("click", function(event)
		{
			editor.quitYes.kill();
			editor.quitNo.kill();
			stage.removeChild(editor.shape3a, editor.quitText);
			editor.impExp.label.visible = true;
			editor.test.label.visible = true;
			editor.quit.label.visible = true;
		});
	});

	this.buttons = [this.quit, this.test, this.impExp, this.newAttack, deleteAttack, copyAttack, page1, page2, page3, page4];

	this.newAttack.forceClick();
	this.loadIDLists();

	entities.push(this);
	//this.helpMap.z = "If 2 bullets collide with eachother, the one with the highest Z position is displayed over the other one. Accepted values are: -2, -1, 0, 1, 2. The enemy's Z position is 0.";
}

Editor.prototype.ontick = function()
{
	if (editor.saveAndLoad != undefined || activity == 2)
		this.helpProperty = undefined;

	if (this.helpProperty != undefined && this.helpFrames++ == 50)
	{
		this.help.text = text.get("ah_" + this.helpProperty);
		this.help.y = stage.mouseY + 20;

		var words = this.help.text.split(" ");
		var multilineText = "";
		var chars = 0;

		for (var w = 0; w < words.length; w++)
		{
			multilineText += (w > 0 && multilineText.charAt(multilineText.length - 1) != '\n' ? " " : "") + words[w];
			chars += words[w].length + 1;

			if (w < words.length - 1 && chars + words[w + 1].length > 63)
			{
				multilineText += "\n";
				chars = 0;
			}
		}

		var fieldsList = ["", this.page1fields, this.page2fields, this.page3fields, this.page4fields][this.tab];

		this.help.text = multilineText;

		if (this.help.y + this.help.getMeasuredHeight() > canvas.height - 56)
			this.help.y += canvas.height - 56 - this.help.y - this.help.getMeasuredHeight();

		for (var f = 0; f < fieldsList.length; f++)
		{
			var field = fieldsList[f];
			var fieldY = field.style.top.replace("px", "") - canvas.offsetTop;

			if (fieldY > this.help.y - 30 && fieldY < this.help.y + 4 + this.help.getMeasuredHeight()&& document.activeElement == field)
				this.help.y -= this.help.getMeasuredHeight() + 42;
		}

		for (var f = 0; f < fieldsList.length; f++)
		{
			var field = fieldsList[f];
			var fieldY = field.style.top.replace("px", "") - canvas.offsetTop;

			if (fieldY > this.help.y - 30 && fieldY < this.help.y + 4 + this.help.getMeasuredHeight())
				field.style.display = "none";
		}

		this.helpShape = new createjs.Shape();
		this.helpShape.name = "editor background1";
		this.helpShape.graphics.beginFill("#678").drawRect(5, this.help.y - 3, canvas.width - 10, 6 + this.help.getMeasuredHeight());

		stage.addChildAt(this.helpShape, stage.getChildIndex(this.help));
		stage.setChildIndex(this.imagePreview, stage.getChildIndex(this.helpShape) - 1);
	}
}

Editor.prototype.setHelp = function(id)
{
	return function(event)
	{
		editor.helpProperty = id;
	};
}

Editor.prototype.loadIDLists = function()
{
	editor.count = 0;

	while (editor.attacksList.length > 0)
		editor.attacksList.remove(0);
	while (editor.nextList.length > 0)
		editor.nextList.remove(0);
	while (editor.triggerList.length > 0)
		editor.triggerList.remove(0);
	while (editor.triggerList2.length > 0)
		editor.triggerList2.remove(0);

	var optionN = document.createElement("option");
	var optionT = document.createElement("option");
	var optionT2 = document.createElement("option");

	optionN.text = noneText;
	optionT.text = noneText;
	optionT2.text = noneText;
	editor.nextList.add(optionN);
	editor.triggerList.add(optionT);
	editor.triggerList2.add(optionT2);

	for (var i = 0; i < editor.fullCode.attacks.length; i++)
	{
		optionA = document.createElement("option");
		optionA.text = "(" + ++editor.count + ") " + (editor.fullCode.attacks[i].id != undefined ? editor.fullCode.attacks[i].id : noIdText);

		editor.attacksList.add(optionA);

		if (editor.fullCode.attacks[i].id != undefined)
		{
			optionN = document.createElement("option");
			optionT = document.createElement("option");
			optionT2 = document.createElement("option");

			optionN.text = "(" + editor.count + ") " + editor.fullCode.attacks[i].id;
			optionT.text = optionN.text;
			optionT2.text = optionN.text;
			editor.nextList.add(optionN);
			editor.triggerList.add(optionT);
			editor.triggerList2.add(optionT2);
		}
	}

	editor.attacksList.value = "(" + (editor.selection + 1) + ") " + (editor.fullCode.attacks[editor.selection].id != undefined ? editor.fullCode.attacks[editor.selection].id : noIdText);

	if (editor.fullCode.attacks[editor.selection].next_id == undefined)
		editor.nextList.value = noneText;
	else
		for (var i = 0; i < editor.fullCode.attacks.length; i++)
		{
			if (editor.fullCode.attacks[i].id == editor.fullCode.attacks[editor.selection].next_id)
				editor.nextList.value = "(" + (i + 1) + ") " + editor.fullCode.attacks[i].id;
		}

	if (editor.fullCode.attacks[editor.selection].trigger_id == undefined)
		editor.triggerList.value = noneText;
	else
		for (var i = 0; i < editor.fullCode.attacks.length; i++)
			if (editor.fullCode.attacks[i].id == editor.fullCode.attacks[editor.selection].trigger_id)
				editor.triggerList.value = "(" + (i + 1) + ") " + editor.fullCode.attacks[i].id;

	if (editor.fullCode.attacks[editor.selection].trigger_id2 == undefined)
		editor.triggerList2.value = noneText;
	else
		for (var i = 0; i < editor.fullCode.attacks.length; i++)
			if (editor.fullCode.attacks[i].id == editor.fullCode.attacks[editor.selection].trigger_id2)
				editor.triggerList2.value = "(" + (i + 1) + ") " + editor.fullCode.attacks[i].id;
}

Editor.prototype.readData = function()
{
	var attack = {};

	if (editor.idField.value != "")
		attack.id = editor.idField.value;
	if (editor.imageList.value != "" + defImage || editor.colorList.value != "" + editor.getColorName(defColor))
		attack.image = getImageId(editor.imageList.value, editor.getColorId(editor.colorList.value));
	if (editor.sizeField.value != defSize / 5 && editor.sizeField.value != "")
		attack.size = parseInt(editor.sizeField.value) * 5;
	if (editor.sizeRandomField.value != 0)
		attack.size_random = parseInt(editor.sizeRandomField.value) * 5;
	if (editor.growthField.value != 0)
		attack.growth = parseInt(editor.growthField.value);
	if (editor.moveNames.indexOf(editor.moveList.value) != 0)
		attack.move = editor.moveNames.indexOf(editor.moveList.value);
	if (editor.soundNames.indexOf(editor.soundList.value) != 0)
		attack.sound = editor.soundNames.indexOf(editor.soundList.value);
	if (editor.lifeField.value != defLife && editor.lifeField.value != "")
		attack.life = parseInt(editor.lifeField.value);
	if (editor.speedField.value != defSpeed && editor.speedField.value != "")
		attack.speed = parseFloat(editor.speedField.value);
	if (editor.speedRandomField.value != 0)
		attack.speed_random = parseFloat(editor.speedRandomField.value);
	if (editor.accelerationField.value != 0)
		attack.acceleration = parseFloat(editor.accelerationField.value);
	if (editor.xField.value != 0)
		attack.x = parseInt(editor.xField.value);
	if (editor.xRandomField.value != 0)
		attack.x_random = parseInt(editor.xRandomField.value);
	if (editor.yField.value != 0)
		attack.y = parseInt(editor.yField.value);
	if (editor.yRandomField.value != 0)
		attack.y_random = parseInt(editor.yRandomField.value);
	if (editor.angleField.value != 0)
		attack.angle = parseFloat(editor.angleField.value);
	if (editor.angleRandomField.value != 0)
		attack.angle_random = parseFloat(editor.angleRandomField.value);
	if (editor.numberField.value != defNumber && editor.numberField.value != "")
		attack.number = parseInt(editor.numberField.value);
	if (editor.angleGapField.value != 0)
		attack.angle_gap = parseFloat(editor.angleGapField.value);
	if (editor.xGapField.value != 0)
		attack.x_gap = parseInt(editor.xGapField.value);
	if (editor.yGapField.value != 0)
		attack.y_gap = parseInt(editor.yGapField.value);
	if (editor.repeatTimesField.value != 0)
		attack.repeat_times = parseInt(editor.repeatTimesField.value);
	if (editor.repeatDelayField.value != defRepeatDelay && editor.repeatDelayField.value != "")
		attack.repeat_delay = parseInt(editor.repeatDelayField.value);
	if (editor.repeatXField.value != 0)
		attack.repeat_x = parseInt(editor.repeatXField.value);
	if (editor.repeatYField.value != 0)
		attack.repeat_y = parseInt(editor.repeatYField.value);
	if (editor.repeatAngleField.value != 0)
		attack.repeat_angle = parseFloat(editor.repeatAngleField.value);
	if (editor.repeatSizeField.value != 0)
		attack.repeat_size = parseFloat(editor.repeatSizeField.value);
	if (editor.repeatSpeedField.value != 0)
		attack.repeat_speed = parseFloat(editor.repeatSpeedField.value);
	if (editor.gravityAngleField.value != "")
		attack.gravity_angle = parseFloat(editor.gravityAngleField.value);
	if (editor.gravityForceField.value != defGravityForce)
		attack.gravity_force = parseFloat(editor.gravityForceField.value);
	if (editor.healthField.value != 0)
		attack.health = parseInt(editor.healthField.value);
	if (editor.triggerList.value != noneText && editor.triggerList.value != "")
		attack.trigger_id = editor.triggerList.value.substring(editor.triggerList.value.indexOf(' ') + 1);
	if (editor.triggerList2.value != noneText && editor.triggerList2.value != "")
		attack.trigger_id2 = editor.triggerList2.value.substring(editor.triggerList2.value.indexOf(' ') + 1);
	if (editor.triggerDelayField.value != defTriggerDelay && editor.triggerDelayField.value != "")
		attack.trigger_delay = parseInt(editor.triggerDelayField.value);
	if (editor.triggerDelayField2.value != defTriggerDelay && editor.triggerDelayField2.value != "")
		attack.trigger_delay2 = parseInt(editor.triggerDelayField2.value);
	if (editor.nextList.value != noneText && editor.nextList.value != "")
		attack.next_id = editor.nextList.value.substring(editor.nextList.value.indexOf(' ') + 1);
	if (editor.nextRandomField.value != "")
	{
		var nextRandom = editor.nextRandomField.value.split(",");

		for (var n = 0; n < nextRandom.length; n++)
			nextRandom[n] = nextRandom[n].trim();

		attack.next_random = nextRandom;
	}
	if (editor.nextHealthField.value != "")
	{
		var nextHealth = editor.nextHealthField.value.split(",");

		for (var n = 0; n < nextHealth.length; n++)
			nextHealth[n] = nextHealth[n].trim();

		attack.next_health = nextHealth;
	}
	if (editor.nextDelayField.value != 0)
		attack.next_delay = parseInt(editor.nextDelayField.value);

	var options = [];

	if (editor.startCheck.checked)
		options.push("start");
	if (editor.ghostCheck.checked)
		options.push("ghost");
	if (editor.vanishCheck.checked)
		options.push("vanish");
	if (editor.absolutePositionCheck.checked)
		options.push("absolute_position");
	if (editor.playerXCheck.checked)
		options.push("player_x");
	if (editor.playerYCheck.checked)
		options.push("player_y");
	if (editor.anglePlayerCheck.checked)
		options.push("angle_player");
	if (editor.repeatLockCheck.checked)
		options.push("repeat_lock");
	if (editor.immunityCheck.checked)
		options.push("immunity");

	if (options.length > 0)
		attack.options = options;

	return attack;
}

Editor.prototype.writeData = function(refreshIDLists)
{
	if (refreshIDLists)
		editor.loadIDLists();

	editor.idField.value = editor.fullCode.attacks[editor.selection].id != undefined ? editor.fullCode.attacks[editor.selection].id : "";
	editor.imageList.value = editor.fullCode.attacks[editor.selection].image != undefined ? editor.fullCode.attacks[editor.selection].image % 100 : defImage;
	editor.colorList.value = editor.getColorName(editor.fullCode.attacks[editor.selection].image != undefined ? Math.floor(editor.fullCode.attacks[editor.selection].image / 100) + 1 : defColor);
	editor.sizeField.value = Math.floor((editor.fullCode.attacks[editor.selection].size != undefined ? editor.fullCode.attacks[editor.selection].size : defSize) / 5);
	editor.sizeRandomField.value = Math.floor((editor.fullCode.attacks[editor.selection].size_random != undefined ? editor.fullCode.attacks[editor.selection].size_random : 0) / 5);
	editor.growthField.value = editor.fullCode.attacks[editor.selection].growth != undefined ? editor.fullCode.attacks[editor.selection].growth : 0;
	editor.moveList.value = editor.moveNames[editor.fullCode.attacks[editor.selection].move != undefined ? editor.fullCode.attacks[editor.selection].move : 0];
	editor.soundList.value = editor.soundNames[editor.fullCode.attacks[editor.selection].sound != undefined ? editor.fullCode.attacks[editor.selection].sound : 0];
	editor.lifeField.value = editor.fullCode.attacks[editor.selection].life != undefined ? editor.fullCode.attacks[editor.selection].life : defLife;
	editor.speedField.value = editor.fullCode.attacks[editor.selection].speed != undefined ? editor.fullCode.attacks[editor.selection].speed : defSpeed;
	editor.speedRandomField.value = editor.fullCode.attacks[editor.selection].speed_random != undefined ? editor.fullCode.attacks[editor.selection].speed_random : 0;
	editor.accelerationField.value = editor.fullCode.attacks[editor.selection].acceleration != undefined ? editor.fullCode.attacks[editor.selection].acceleration : 0;
	editor.xField.value = editor.fullCode.attacks[editor.selection].x != undefined ? editor.fullCode.attacks[editor.selection].x : 0;
	editor.xRandomField.value = editor.fullCode.attacks[editor.selection].x_random != undefined ? editor.fullCode.attacks[editor.selection].x_random : 0;
	editor.yField.value = editor.fullCode.attacks[editor.selection].y != undefined ? editor.fullCode.attacks[editor.selection].y : 0;
	editor.yRandomField.value = editor.fullCode.attacks[editor.selection].y_random != undefined ? editor.fullCode.attacks[editor.selection].y_random : 0;
	editor.angleField.value = editor.fullCode.attacks[editor.selection].angle != undefined ? editor.fullCode.attacks[editor.selection].angle : 0;
	editor.angleRandomField.value = editor.fullCode.attacks[editor.selection].angle_random != undefined ? editor.fullCode.attacks[editor.selection].angle_random : 0;
	editor.numberField.value = editor.fullCode.attacks[editor.selection].number != undefined ? editor.fullCode.attacks[editor.selection].number : defNumber;
	editor.angleGapField.value = editor.fullCode.attacks[editor.selection].angle_gap != undefined ? editor.fullCode.attacks[editor.selection].angle_gap : 0;
	editor.xGapField.value = editor.fullCode.attacks[editor.selection].x_gap != undefined ? editor.fullCode.attacks[editor.selection].x_gap : 0;
	editor.yGapField.value = editor.fullCode.attacks[editor.selection].y_gap != undefined ? editor.fullCode.attacks[editor.selection].y_gap : 0;
	editor.repeatTimesField.value = editor.fullCode.attacks[editor.selection].repeat_times != undefined ? editor.fullCode.attacks[editor.selection].repeat_times : 0;
	editor.repeatDelayField.value = editor.fullCode.attacks[editor.selection].repeat_delay != undefined ? editor.fullCode.attacks[editor.selection].repeat_delay : defRepeatDelay;
	editor.repeatXField.value = editor.fullCode.attacks[editor.selection].repeat_x != undefined ? editor.fullCode.attacks[editor.selection].repeat_x : 0;
	editor.repeatYField.value = editor.fullCode.attacks[editor.selection].repeat_y != undefined ? editor.fullCode.attacks[editor.selection].repeat_y : 0;
	editor.repeatAngleField.value = editor.fullCode.attacks[editor.selection].repeat_angle != undefined ? editor.fullCode.attacks[editor.selection].repeat_angle : 0;
	editor.repeatSizeField.value = editor.fullCode.attacks[editor.selection].repeat_size != undefined ? editor.fullCode.attacks[editor.selection].repeat_size : 0;
	editor.repeatSpeedField.value = editor.fullCode.attacks[editor.selection].repeat_speed != undefined ? editor.fullCode.attacks[editor.selection].repeat_speed : 0;
	editor.gravityAngleField.value = editor.fullCode.attacks[editor.selection].gravity_angle != undefined ? editor.fullCode.attacks[editor.selection].gravity_angle : "";
	editor.gravityForceField.value = editor.fullCode.attacks[editor.selection].gravity_force != undefined ? editor.fullCode.attacks[editor.selection].gravity_force : defGravityForce;
	editor.healthField.value = editor.fullCode.attacks[editor.selection].health != undefined ? editor.fullCode.attacks[editor.selection].health : 0;
	editor.triggerDelayField.value = editor.fullCode.attacks[editor.selection].trigger_delay != undefined ? editor.fullCode.attacks[editor.selection].trigger_delay : defTriggerDelay;
	editor.triggerDelayField2.value = editor.fullCode.attacks[editor.selection].trigger_delay2 != undefined ? editor.fullCode.attacks[editor.selection].trigger_delay2 : defTriggerDelay;
	editor.nextRandomField.value = editor.fullCode.attacks[editor.selection].next_random != undefined ? editor.fullCode.attacks[editor.selection].next_random : "";
	editor.nextHealthField.value = editor.fullCode.attacks[editor.selection].next_health != undefined ? editor.fullCode.attacks[editor.selection].next_health : "";
	editor.nextDelayField.value = editor.fullCode.attacks[editor.selection].next_delay != undefined ? editor.fullCode.attacks[editor.selection].next_delay : 0;

	editor.oldId = editor.idField.value;

	if (editor.fullCode.attacks[editor.selection].next_id == undefined)
		editor.nextList.value = noneText;
	else
		for (var i = 0; i < editor.fullCode.attacks.length; i++)
			if (editor.fullCode.attacks[i].id == editor.fullCode.attacks[editor.selection].next_id)
				editor.nextList.value = "(" + (i + 1) + ") " + editor.fullCode.attacks[i].id;

	if (editor.fullCode.attacks[editor.selection].trigger_id == undefined)
		editor.triggerList.value = noneText;
	else
		for (var i = 0; i < editor.fullCode.attacks.length; i++)
			if (editor.fullCode.attacks[i].id == editor.fullCode.attacks[editor.selection].trigger_id)
				editor.triggerList.value = "(" + (i + 1) + ") " + editor.fullCode.attacks[i].id;

	if (editor.fullCode.attacks[editor.selection].trigger_id2 == undefined)
		editor.triggerList2.value = noneText;
	else
		for (var i = 0; i < editor.fullCode.attacks.length; i++)
			if (editor.fullCode.attacks[i].id == editor.fullCode.attacks[editor.selection].trigger_id2)
				editor.triggerList2.value = "(" + (i + 1) + ") " + editor.fullCode.attacks[i].id;

	stage.removeChild(editor.imagePreview);

	editor.imagePreview = new createjs.Sprite(sheet);
	editor.imagePreview.gotoAndStop(getImageIndex(getImageId(editor.imageList.value, editor.getColorId(editor.colorList.value))));
	editor.imagePreview.name = "image preview";
	editor.imagePreview.x = 150;
	editor.imagePreview.y = 374;
	editor.imagePreview.scaleX = 0.2;
	editor.imagePreview.scaleY = 0.2;
	editor.imagePreview.visible = editor.tab == 1;

	if (editor.saveAndLoad != undefined)
		stage.addChildAt(editor.imagePreview, stage.getChildIndex(editor.saveAndLoad.background) - 1);
	else
		stage.addChild(editor.imagePreview);

	editor.anglePreview.rotation = -editor.angleField.value;
	editor.gravityAnglePreview.visible = editor.gravityAngleField.value != "" && editor.tab == 2;
	editor.gravityAnglePreview.rotation = -editor.gravityAngleField.value;

	editor.angleGapText.color = editor.numberField.value > 1 ? "#fff" : "#777";
	editor.xGapText.color = editor.numberField.value > 1 ? "#fff" : "#777";
	editor.yGapText.color = editor.numberField.value > 1 ? "#fff" : "#777";
	editor.triggerDelayText.color = editor.triggerList.value != noneText ? "#fff" : "#777";
	editor.triggerDelayText2.color = editor.triggerList2.value != noneText ? "#fff" : "#777";
	editor.nextDelayText.color = editor.nextList.value != noneText || editor.nextRandomField.value != "" || editor.nextHealthField.value != "" ? "#fff" : "#777";
	editor.nextRandomText.color = editor.nextList.value == noneText ? "#fff" : "#777";
	editor.nextHealthText.color = editor.nextList.value == noneText && editor.nextRandomField.value == "" ? "#fff" : "#777";
	editor.repeatDelayText.color = editor.repeatTimesField.value > 0 ? "#fff" : "#777";
	editor.repeatAngleText.color = editor.repeatTimesField.value > 0 ? "#fff" : "#777";
	editor.repeatXText.color = editor.repeatTimesField.value > 0 ? "#fff" : "#777";
	editor.repeatYText.color = editor.repeatTimesField.value > 0 ? "#fff" : "#777";
	editor.repeatSizeText.color = editor.repeatTimesField.value > 0 ? "#fff" : "#777";
	editor.repeatSpeedText.color = editor.repeatTimesField.value > 0 ? "#fff" : "#777";
	editor.gravityForceText.color = editor.gravityAngleField.value != "" ? "#fff" : "#777";

	editor.startCheck.checked = editor.fullCode.attacks[editor.selection].options != undefined && editor.fullCode.attacks[editor.selection].options.indexOf("start") > -1 ? "checked" : "";
	editor.ghostCheck.checked = editor.fullCode.attacks[editor.selection].options != undefined && editor.fullCode.attacks[editor.selection].options.indexOf("ghost") > -1 ? "checked" : "";
	editor.vanishCheck.checked = editor.fullCode.attacks[editor.selection].options != undefined && editor.fullCode.attacks[editor.selection].options.indexOf("vanish") > -1 ? "checked" : "";
	editor.absolutePositionCheck.checked = editor.fullCode.attacks[editor.selection].options != undefined && editor.fullCode.attacks[editor.selection].options.indexOf("absolute_position") > -1 ? "checked" : "";
	editor.playerXCheck.checked = editor.fullCode.attacks[editor.selection].options != undefined && editor.fullCode.attacks[editor.selection].options.indexOf("player_x") > -1 ? "checked" : "";
	editor.playerYCheck.checked = editor.fullCode.attacks[editor.selection].options != undefined && editor.fullCode.attacks[editor.selection].options.indexOf("player_y") > -1 ? "checked" : "";
	editor.anglePlayerCheck.checked = editor.fullCode.attacks[editor.selection].options != undefined && editor.fullCode.attacks[editor.selection].options.indexOf("angle_player") > -1 ? "checked" : "";
	editor.repeatLockCheck.checked = editor.fullCode.attacks[editor.selection].options != undefined && editor.fullCode.attacks[editor.selection].options.indexOf("repeat_lock") > -1 ? "checked" : "";
	editor.immunityCheck.checked = editor.fullCode.attacks[editor.selection].options != undefined && editor.fullCode.attacks[editor.selection].options.indexOf("immunity") > -1 ? "checked" : "";

	editor.repeatLockText.color = editor.repeatTimesField.value > 0 ? "#fff" : "#777";
	editor.absolutePositionText.color = editor.playerXCheck.checked || editor.playerYCheck.checked ? "#777" : "#fff";

	// compatibilité versions 0.2-0.3
	if (editor.fullCode.attacks[editor.selection].options != undefined && editor.fullCode.attacks[editor.selection].options.indexOf("mute") > -1)
		editor.soundList.value = editor.soundNames[1];
}

Editor.prototype.getColorId = function(name)
{
	return this.colorNames.indexOf(name);
}

Editor.prototype.getColorName = function(id)
{
	return this.colorNames[id];
}

Editor.prototype.kill = function()
{
	this.remove = true;

	for (var b = 0; b < this.buttons.length; b++)
		this.buttons[b].kill();
	for (var f = 0; f < this.fields.length; f++)
		document.body.removeChild(document.getElementById(this.fields[f]));

	if (this.saveAndLoad != undefined)
		this.saveAndLoad.kill();

	for (var n = 0; n < this.names.length; n++)
		stage.removeChild(this.names[n]);

	for (var n = 0; n < this.categs.length; n++)
		stage.removeChild(this.categs[n]);

	stage.removeChild(this.shape1, this.shape2, this.shape3, this.shape4, this.attacksText, this.selectedTab, this.imagePreview, this.anglePreview, this.gravityAnglePreview, this.help);
	editor = undefined;
	activity = 1;

	if (selectedTab.x == 237)
		codeField.style.display = "block";
}

Editor.prototype.toString = function()
{
	return "Editor";
}