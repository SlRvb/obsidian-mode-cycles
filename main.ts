import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface ModeCyclesSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ModeCyclesSettings = {
	mySetting: 'default'
}

export default class ModeCycles extends Plugin {
	// settings: ModeCyclesSettings;

	async onload() {
		//Settings
		// await this.loadSettings();
		// this.addSettingTab(new ModeCyclesSettings(this.app, this));

		const ribbonCycleNote = this.addRibbonIcon('copy', 'Cycle Note Mode', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			noteCycle();
		});
		
		//Note Cycle Command
		this.addCommand({
			id: 'note-mode-cycle',
			name: 'Cycle Note Mode', //Source > Live Preview > Reading
			checkCallback: (checking: boolean) => {
				if (this.app.workspace.getActiveViewOfType(MarkdownView)) { 
					if (!checking) { noteCycle(); } 
					return true	
				} else { errorMessages(errorNote) }
			}
		});


		const ribbonCycleDarkLight = this.addRibbonIcon('eye', 'Cycle Dark / Light Mode', (evt: MouseEvent) => { darkLightCycle(); });
		
		//Note Cycle Command
		this.addCommand({
			id: 'dark-light-mode-cycle',
			name: 'Cycle Dark / Light Mode',
			callback: () => { darkLightCycle() }
		});

	}

	onunload() {

	}

	// async loadSettings() { this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()); }
	// async saveSettings() { await this.saveData(this.settings); }
}

let currentMode: string;
let errorNote;

function errorMessages(error) {
	return new Notice(error)
}


//Cycle Note Mode
function noteCycle() {
	const thisApp = this.app.workspace
	const noteMode = thisApp.getActiveViewOfType(MarkdownView)?.currentMode;
	errorNote = "No note active!\nTry clicking on a note to cycle through that note's modes.";


	//Check if Markdown Note, else throw error notice
	if (noteMode == undefined) { return errorMessages(errorNote); } 
	// console.debug(noteMode);

	
	if (noteMode.type == "preview") {
		currentMode = "reading";
	} else if (noteMode.type == "source" && noteMode.sourceMode == true) {
		currentMode = "source";
	} else if (noteMode.type == "source" && noteMode.sourceMode == false) {
		currentMode = "live";
	}
	// console.debug(currentMode);

	//Cycle to next mode: Source --> Live Preview --> Reading
	let newNoteMode = thisApp.activeLeaf.getViewState();
	switch (currentMode) {
		case "reading":
			//Reading -> Source
			newNoteMode.state.mode = "source";
			newNoteMode.state.source = true;
			break;
		case "source":
			//Source -> Live
			newNoteMode.state.mode = "source";
			newNoteMode.state.source = false;
			break;
		case "live":
			//Live -> Reading
			newNoteMode.state.mode = "preview";
			newNoteMode.state.source = false;
			break;
	}
	// console.debug(newNoteMode)

	return this.app.workspace.activeLeaf.setViewState(newNoteMode);
}


//Cycle Dark / Light Mode
function darkLightCycle() {
	const darkMode = this.app.vault.getConfig("theme") === "obsidian";

    if (darkMode) {
        this.app.setTheme("moonstone");
        this.app.vault.setConfig("theme", "moonstone");
    } else {
        this.app.setTheme("obsidian");
        this.app.vault.setConfig("theme", "obsidian");
    }
}


//Cycle List Modes
// function listCycle() {

// }


// class ModeCyclesSettings extends PluginSettingTab {
// 	plugin: ModeCycles;

// 	constructor(app: App, plugin: ModeCycles) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty() // Clear when reopening
// 		containerEl.createEl('h1', {text: 'Mode Cycles'});

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
