import Command from '@ckeditor/ckeditor5-core/src/command'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import {
	toWidget,
	viewToModelPositionOutsideModelElement
} from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import './theme/inlinebox.css'

export default class FillDnD extends Plugin {
	static get requires() {
		return [FillTheBlankEditingDnD, FillTheBlankUIDnD]
	}
}

// generate random elemen id
function _generateSpanIDs(length) {
	var result           = [];
	var characters       = '123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
	return result.join('');
}

class FillTheBlankEditingDnD extends Plugin {
	static get requires() {
		return [Widget]
	}

	init() {
		console.log('FillTheBlankEditingDnD#init() got called')

		this._defineSchema()
		this._defineConverters()
		// this._createLabelMark()

		this.editor.commands.add('fillDnD', new FillTheBlankCommand(this.editor))

		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) =>
				viewElement.hasClass('fillDnD')
			)
		)
	}

	_defineSchema() {
		const schema = this.editor.model.schema

		schema.register('fillDnD', {
			// Allow wherever text is allowed:
			allowWhere: '$text',

			// The fill will act as an inline node:
			isInline: true,

			// The inline widget is self-contained so it cannot be split by the caret and it can be selected:
			isObject: true,

			// The fill can have many types, like date, name, surname, etc:
			allowAttributes: ['name'],
		})
	}

	// _createLabelMark() {
	// 	const editorConfig = this.editor.config._config 
	// 	const {fillBg} = editorConfig.alertConfig
  //   let style = document.createElement('style');
	// 	style.type = 'text/css';
	// 	style.innerHTML = `${fillBg.class} { background: ${fillBg.background} !important;color: ${fillBg.color} !important; }`;
	// 	document.getElementsByTagName('head')[0].appendChild(style);
	// }

	_defineConverters() {
		const conversion = this.editor.conversion
		const editorConfig = this.editor.config._config
		const {fillBg} = editorConfig.alertConfig

		conversion.for('upcast').elementToElement({
			view: {
				name: 'span',
				classes: fillBg.class.replace(/[^\w\s]/gi, ''),
			},
			model: (viewElement, { writer: modelWriter }) => {
				// console.log(viewElement.getChild(0))
				let name;
				let isImage = false;
				if (viewElement.getChild(0).name !== "img") {
						name = viewElement.getChild(0).data.slice(1, -1)
				} else {
						name = viewElement.getChild(0)._attrs.get("data-source")
						isImage = true
				}

				return modelWriter.createElement('fillDnD', { name , isImage })
			},
		})

		conversion.for('dataDowncast').elementToElement({
			model: 'fillDnD',
			view: (modelItem, { writer: viewWriter }) =>
				createFillView(modelItem, viewWriter),
		})

		conversion.for('editingDowncast').elementToElement({
			model: 'fillDnD',
			view: (modelItem, { writer: viewWriter }) => {
				const widgetElement = createFillView(modelItem, viewWriter)

				// Enable widget handling on a fill element inside the editing view.
				return toWidget(widgetElement, viewWriter)
			},
		})

		// Helper method for both downcast converters.
		function createFillView(modelItem, viewWriter) {
			const name = modelItem.getAttribute('name')
			
			let parentID = name.split('-')[1]
			if(parentID === undefined) {
				parentID = _generateSpanIDs(5)
			}

			const fillView = viewWriter.createContainerElement('span', {
				class: fillBg.class.replace(/[^\w\s]/gi, ''),
				name: editorConfig.fillConfig,
				id: parentID
			})

			let content = viewWriter.createText(' ' + name + ' ');
			
			viewWriter.insert(viewWriter.createPositionAt(fillView, 0), content);

			return fillView
		}
	}
}

class FillTheBlankCommand extends Command {
	execute() {
		const editor = this.editor
		const editorConfig = editor.config._config
		const {alertTitle, errorMessage, sweetStyle, customClass} = editorConfig.alertConfig

		/**
		 * [customClass] an attribute from (https://sweetalert2.github.io/#examples)
		 * [sweetStyle] is sweet alert property (https://sweetalert2.github.io/)
		 */
 
		 editor.model.change((writer) => {
			// const simpleBox = writer.createElement('simpleBox')
			// Create a <fill> elment with the "name" attribute...
			const fill = writer.createElement('fillDnD', {
				name: `Fill Box ID - ${_generateSpanIDs(5)}`,
			})
			// writer.append(fill, simpleBox)

			// ... and insert it into the document.
			editor.model.insertContent(fill)

			// Put the selection on the inserted element.
			writer.setSelection(fill, 'on')
		})
	}

	refresh() {
		const model = this.editor.model
		const selection = model.document.selection
		const isAllowed = model.schema.checkChild(selection.focus.parent, 'fillDnD')

		this.isEnabled = isAllowed
	}
}

// create the ui
class FillTheBlankUIDnD extends Plugin {
	init() {
		const editor = this.editor
		const t = editor.t
		const editorConfig = editor.config._config

		// The "fill" dropdown must be registered among the UI components of the editor
		// to be displayed in the toolbar.
		editor.ui.componentFactory.add('fillDnD', (locale) => {
			const buttonView = new ButtonView(locale)
			buttonView.set({
				// The t() function helps localize the editor. All strings enclosed in t() can be
				// translated and change when the language of the editor changes.
				label: t('Fill DnD'),
				withText: true,
				tooltip: true,
				isVisible: !editorConfig.isFIllDndDisable
			})

			// Disable the fill button when the command is disabled.
			const command = editor.commands.get('fillDnD')
			// Bind the state of the button to the command.
			buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled')

			// Execute the command when the dropdown item is clicked (executed).
			this.listenTo(buttonView, 'execute', (evt) => {
				editor.execute('fillDnD')
				// editor.editing.view.focus()
			})

			return buttonView
		})
	}
}
