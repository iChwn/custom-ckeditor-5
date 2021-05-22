/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
// import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
// import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
// import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
// import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
// import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
// import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
// import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Heading from '@ckeditor/ckeditor5-heading/src/heading';
// import Image from '@ckeditor/ckeditor5-image/src/image';
// import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
// import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
// import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
// import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
// import Indent from '@ckeditor/ckeditor5-indent/src/indent';
// import Link from '@ckeditor/ckeditor5-link/src/link';
// import List from '@ckeditor/ckeditor5-list/src/list';
// import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
// import Table from '@ckeditor/ckeditor5-table/src/table';
// import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
// import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
// import Fill from './inline-box/inlinebox';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder'
// import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage'
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js'
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js'
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily.js'
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import Indent from '@ckeditor/ckeditor5-indent/src/indent'
import Link from '@ckeditor/ckeditor5-link/src/link'
import List from '@ckeditor/ckeditor5-list/src/list'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties'
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation'
import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter'
import MathType from '@wiris/mathtype-ckeditor5'
import Fill from './inline-box/inlinebox'
// import SimpleBox from './sample-box/simplebox'

class IchEditor extends ClassicEditorBase {}

// Plugins to include in the build.
IchEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	Underline,
	CKFinder,
	// EasyImage,
	Heading, //must be imported
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar, 
	TableProperties, 
	TableCellProperties,
	TextTransformation,
	MathType,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Alignment,
	Fill,
	Base64UploadAdapter,
];

// Editor configuration.
IchEditor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'underline',
			// 'link',
			'bulletedList',
			'numberedList',
			'|',
			// 'indent',
			// 'outdent',
			// '|',
			'fontFamily',
			'fontSize',
			'fontColor',
			'fontBackgroundColor',
			'alignment',
			'|',
			'imageUpload',
			'insertTable',
			'mediaEmbed',
			// 'undo',
			// 'redo',
			'|',
			'MathType',
			'ChemType',
			'fill',
		],
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative',
		],
	},
	table: {
		contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells','tableProperties', 'tableCellProperties'],
	},
	fontFamily: {
		options: [
			'default',
			'عثمان طه',
			'Ubuntu, Arial, sans-serif',
			'Ubuntu Mono, Courier New, Courier, monospace',
			'Open Sans',
		],
		// supportAllValues: true,
	},
	fontSize: {
		options: [
				9,
				11,
				13,
				'default',
				17,
				19,
				21
		]
	},
	fillConfig: "",
	isFIllDisable: true,
	alertConfig: {
		errorMessage: "You need to write the Answer!",
		alertTitle: "Fill the Answer",
		sweetStyle: { 
			width: '500px',
			padding: '1.25em',
			confirmButtonText: "Save",
			cancelButtonText: "Close",
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			reverseButtons: false,
		},
		customClass: {},
		fillBg: {
			class: '.fill',
		},
	}
}

export default IchEditor