import Command from '@ckeditor/ckeditor5-core/src/command'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import {
	toWidget,
	viewToModelPositionOutsideModelElement
} from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import Swal from 'sweetalert2'
import './theme/inlinebox.css'

export default class Fill extends Plugin {
	static get requires() {
		return [FillTheBlankEditing, FillTheBlankUI]
	}
}

class FillTheBlankEditing extends Plugin {
	static get requires() {
		return [Widget]
	}

	init() {
		console.log('FillTheBlankEditing#init() got called')

		this._defineSchema()
		this._defineConverters()
		// this._createLabelMark()

		this.editor.commands.add('fill', new FillTheBlankCommand(this.editor))

		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) =>
				viewElement.hasClass('fill')
			)
		)
	}

	_defineSchema() {
		const schema = this.editor.model.schema

		schema.register('fill', {
			// Allow wherever text is allowed:
			allowWhere: '$text',

			// The fill will act as an inline node:
			isInline: true,

			// The inline widget is self-contained so it cannot be split by the caret and it can be selected:
			isObject: true,

			// The fill can have many types, like date, name, surname, etc:
			allowAttributes: ['name', 'isImage'],
		})
	}

	// generate random elemen id 
	_generateSpanID(length) {
		var result           = [];
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
			}
			return result.join('');
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
		const _ROOT = this
		const editorConfig = this.editor.config._config
		const {fillBg} = editorConfig.alertConfig

		conversion.for('upcast').elementToElement({
			view: {
				name: 'span',
				classes: fillBg.class.replace(/[^\w\s]/gi, ''),
			},
			model: (viewElement, { writer: modelWriter }) => {
				// Extract the "name" from "{name}".
                console.log(viewElement.getChild(0))
                let name;
                let isImage = false;
                if (viewElement.getChild(0).name !== "img") {
                    name = viewElement.getChild(0).data.slice(1, -1)
                } else {
                    name = viewElement.getChild(0)._attrs.get("data-source")
                    isImage = true
                }

				return modelWriter.createElement('fill', { name , isImage })
			},
		})

		conversion.for('dataDowncast').elementToElement({
			model: 'fill',
			view: (modelItem, { writer: viewWriter }) =>
				createFillView(modelItem, viewWriter),
		})

		conversion.for('editingDowncast').elementToElement({
			model: 'fill',
			view: (modelItem, { writer: viewWriter }) => {
				const widgetElement = createFillView(modelItem, viewWriter)

				// Enable widget handling on a fill element inside the editing view.
				return toWidget(widgetElement, viewWriter)
			},
		})

		// Helper method for both downcast converters.
		function createFillView(modelItem, viewWriter) {
			const name = modelItem.getAttribute('name')
			const isImage = modelItem.getAttribute('isImage')
			const fillView = viewWriter.createContainerElement('span', {
				class: fillBg.class.replace(/[^\w\s]/gi, ''),
				name: editorConfig.fillConfig,
				id: _ROOT._generateSpanID(5)
			})

			// Insert the fill name (as a text).
			let content;
			// console.log('modelItem', modelItem);
			// console.log('viewWriter', viewWriter);
			// console.log('fillView', fillView);
			if (isImage) {
				content = viewWriter.createEmptyElement('img', { src: name, width: 128, "data-source": name });
			} else {
				content = viewWriter.createText(' ' + name + ' ');
			}
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

		Swal.fire({
			title: alertTitle,
			html: `<div class="input-group mb-3">
        <textarea class="form-control" name="fill-input" rows="4" maxlength="100"></textarea>
        <div class="input-group-append">
		  <input type="file" id="fill-file" hidden accept="image/*">
          <label class="btn btn-outline-secondary" for="fill-file">Image</label>
        </div>
      </div>
      <div class="absolute-counter mb-3">
	  You write &nbsp;<b><a id="count-text"> 0 </a></b>&nbsp; characters
	</div>
`,
			showCancelButton: true,
			customClass,
			...sweetStyle,
			input: 'text',
			inputValidator: _ => {
				let contentContainer = Swal.getHtmlContainer();
				let inputText = document.querySelector(`#${contentContainer.id} textarea[name="fill-input"]`);
				let inputFile = document.querySelector(`#${contentContainer.id} input#fill-file`);
				if (inputFile.files.length || inputText.value) {
					_setValue(!inputFile.files.length ? inputText.value : inputFile.files[0], !!inputFile.files.length);
					return;
				}
				return errorMessage;
			},
			onOpen: () => {
				let swalContent = Swal.getContent();
				let contentContainer = Swal.getHtmlContainer();
				let defaultInput = document.querySelector(`.${swalContent.classList[0]} input.swal2-input`);
				let inputText = document.querySelector(`#${contentContainer.id} textarea[name="fill-input"]`);
				let inputFile = document.querySelector(`#${contentContainer.id} input#fill-file`);
				// let uploadCommand = editor.commands.get('uploadImage');

				/* Force style change to UI */
				contentContainer.style.position = 'inherit';
				defaultInput.style.display = 'none';

				inputText.oninput = _ => {
					document.querySelector(`#${contentContainer.id} #count-text`).innerHTML = inputText.value.length
				}

				inputFile.onchange = (event) => {
					if (!event.target.files.length) {
						return false;
					}
					Swal.getConfirmButton().click()
					// editor.execute(uploadCommand, { file: event.target.files[0] });
				}
			},
		})

		const _fileToBase64 = file => {
			return new Promise((resolve) => {
				const reader = new FileReader()
				reader.onloadend = () => resolve(reader.result)
				reader.readAsDataURL(file)
			});
		}

		const _setValue = async (value, isImage = false) => {
			// console.log(value);
			// console.log(isImage);
			if (isImage) {
				value = await _fileToBase64(value);
			}
			editor.model.change((writer) => {
				// const simpleBox = writer.createElement('simpleBox')
				// Create a <fill> elment with the "name" attribute...
				const fill = writer.createElement('fill', {
					name: value,
					isImage: isImage
				})
				// writer.append(fill, simpleBox)

				// ... and insert it into the document.
				editor.model.insertContent(fill)

				// Put the selection on the inserted element.
				writer.setSelection(fill, 'on')
			})
		}
	}

	refresh() {
		const model = this.editor.model
		const selection = model.document.selection
		const isAllowed = model.schema.checkChild(selection.focus.parent, 'fill')

		this.isEnabled = isAllowed
	}
}

// create the ui
class FillTheBlankUI extends Plugin {
	init() {
		const editor = this.editor
		const t = editor.t
		const editorConfig = editor.config._config

		// The "fill" dropdown must be registered among the UI components of the editor
		// to be displayed in the toolbar.
		editor.ui.componentFactory.add('fill', (locale) => {
			const buttonView = new ButtonView(locale)
			buttonView.set({
				// The t() function helps localize the editor. All strings enclosed in t() can be
				// translated and change when the language of the editor changes.
				label: t('Fill'),
				withText: true,
				tooltip: true,
				isVisible: !editorConfig.isFIllDisable
			})

			// Disable the fill button when the command is disabled.
			const command = editor.commands.get('fill')
			// Bind the state of the button to the command.
			buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled')

			// Execute the command when the dropdown item is clicked (executed).
			this.listenTo(buttonView, 'execute', (evt) => {
				editor.execute('fill')
				// editor.editing.view.focus()
			})

			return buttonView
		})
	}
}
