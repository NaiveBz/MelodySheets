var createSpaceSavingArtist = function(border, width, canvas, scale) {
	if (typeof scale === "undefined") {
		scale = 1;
	}
	
	staveWidth = (width - 2*border)/scale;

	SpaceSavingArtist = function() {
		this.staveOptions = {};
	};
	
	//FIXME: more annotations then elements
	//	SpaceSavingArtist.prototype = new Vex.Flow.Artist(border, 0, (canvas.width - border) / 4, {});
	SpaceSavingArtist.prototype = new Vex.Flow.Artist(border, 0, staveWidth, {scale: scale});
	SpaceSavingArtist.prototype.SpaceSavingArtist = SpaceSavingArtist;
	SpaceSavingArtist.prototype.originalAddStave = SpaceSavingArtist.prototype.addStave;
	SpaceSavingArtist.prototype.originalAddNote = SpaceSavingArtist.prototype.addNote;

	SpaceSavingArtist.prototype.addStave = function(options) {
		//if it has the same options as current stave, do not create new one
		if (_.isEqual(this.staveOptions, options))
			return;

		//something changed in stave configuration - we need to create a new stave
		this.staveOptions = options;
		this.originalAddStave(options);
	};

	SpaceSavingArtist.prototype.staveTooFull = function() {
		var currentStave = _.last(this.staves);
		var previousNotes = currentStave.note_notes;

		return !this.fitIntoStave(currentStave, currentStave.note_notes);
	}

	SpaceSavingArtist.prototype.addNote = function(note) {
		//FIXME: ak je posledna stave poloprazdna, tak je vykreslena skaredo
		this.originalAddNote(note);
		if (this.staveTooFull()) {
			var lastStave = _.last(this.staves);
			this.originalAddStave(this.staveOptions); 
			var currentStave = _.last(this.staves);

			// move stave ending to the new stave - we need to move two notes so there is 
			// some space between notes
			if (lastStave.note_notes.length < 2) 
				return ;
			
			var lastNote = lastStave.note_notes.pop();
			var beforeLastNote = lastStave.note_notes.pop(); 
			
			currentStave.note_notes.push(beforeLastNote);
			currentStave.note_notes.push(lastNote);
		}
	};

	SpaceSavingArtist.prototype.fitIntoStave = function(stave, notes) {
		var availableWidthForNotes = stave.note.getNoteEndX() - stave.note.getNoteStartX() - 10;
		var formatter = new Vex.Flow.Formatter();
		var voice = new Vex.Flow.Voice(Vex.Flow.TIME4_4).setMode(Vex.Flow.Voice.Mode.SOFT);
		voice.addTickables(notes);

		formatter.format([voice], availableWidthForNotes, {});
		var minTotalWidth = formatter.getMinTotalWidth() + notes.length*3;

		return minTotalWidth <= availableWidthForNotes;
	};

	SpaceSavingArtist.prototype.minimizeSpaceAndRender = function(renderer) {
		var lastStave = this.staves.pop();
		this.render(renderer);
		this.formatAndRender(renderer.getContext(), null, {stave: lastStave.note, voices: lastStave.note_voices}  
	};

	return new SpaceSavingArtist();
};
