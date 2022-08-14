var buttonPressed;
var mousePressed = false;

function Button(text, x, y, width, color)
{
	if (color != undefined)
	{
		this.label = new createjs.Text(text, font, color);
		this.label.name = "button " + text;
		this.label.x = x - this.label.getMeasuredWidth() / 2;
		this.label.y = y;
		this.label.hitArea = new createjs.Shape();
		this.label.hitArea.graphics.beginFill("#000").drawRect((width - this.label.getMeasuredWidth()) / -2, -4, width, this.label.getMeasuredHeight() + 14);
		this.label.button = this;

		this.shapeL = new createjs.Shape();
		this.shapeL.graphics.setStrokeStyle(2).beginStroke(color).drawRoundRect(x - width / 2, this.label.y - 4, width, this.label.getMeasuredHeight() + 14, 7);
		this.shapeL.cache(x - width / 2 - 2, this.label.y - 4, 5, this.label.getMeasuredHeight() + 14);
		this.shapeR = this.shapeL.clone();
		this.shapeR.cache(x + width / 2 - 3, this.label.y - 4, 5, this.label.getMeasuredHeight() + 14);

		this.hitbox = this.label;
		stage.addChild(this.hitbox, this.shapeL, this.shapeR);
	}
	else
	{
		this.image = new createjs.Bitmap(loader.getResult(text));
		this.image.name = "button " + text;
		this.image.x = x;
		this.image.y = y;
		this.image.hitArea = new createjs.Shape();
		this.image.hitArea.graphics.beginFill("#000").drawRect(0, 0, this.image.getBounds().width, this.image.getBounds().height);
		this.image.button = this;

		this.hitbox = this.image;
		stage.addChild(this.image);
		entities.push(this);
	}

	this.hitbox.button = this;
	this.hitbox.activity = activity;

	this.hitbox.on("rollover", function(event)
	{
		buttonHover = event.target.button;
		event.target.shadow = new createjs.Shadow("#ccc", 0, 0, 15);

		if (mousePressed && buttonPressed == event.target.button)
			event.target.shadow = new createjs.Shadow("#fff", 0, 0, 15);
	});
	this.hitbox.on("rollout", function(event)
	{
		buttonHover = undefined;
		event.target.shadow = null;
	});
	this.hitbox.on("mousedown", function(event)
	{
		if (event.target.activity == activity)
			createjs.Sound.play("button");

		event.target.shadow = new createjs.Shadow("#fff", 0, 0, 15);
		buttonPressed = event.target.button;
	});
	this.hitbox.on("click", function(event)
	{
		event.target.shadow = new createjs.Shadow("#ccc", 0, 0, 15);
	});

	this.cursor = "pointer";
	this.mouseChildren = false;
}

Button.prototype.ontick = function()
{
	
}

Button.prototype.forceClick = function()
{
	this.hitbox.dispatchEvent(new createjs.Event("click"));
	this.hitbox.shadow = null;
}

Button.prototype.updateText = function(text)
{
	var x = this.label.x + this.label.getMeasuredWidth() / 2;

	this.label.text = text;
	this.label.x = x - this.label.getMeasuredWidth() / 2;
}

Button.prototype.kill = function()
{
	if (this.label != undefined)
		stage.removeChild(this.label, this.shapeL, this.shapeR);
	else
	{
		entities.splice(entities.indexOf(this), 1);
		stage.removeChild(this.image);
	}
}

Button.prototype.toString = function()
{
	return "Button " + (this.label != undefined ? this.label.text : this.image.name);
}