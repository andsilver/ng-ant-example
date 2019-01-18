import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { MonacoFile, MonacoEditorOptions } from 'ngx-monaco';
import neon from '../../monaco-editor.config';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {

  @Input()
  language = 'html';

  @Input()
  content = '';

  @Input()
  theme = 'vs';

  @Input()
  height = 500;

  @Output()
  contentChange = new EventEmitter();

  options = {
    theme: 'vs',
    language: 'neon',
    automaticLayout: true,
    minimap: {
        enabled: false
      },
      autoIndent: true
  };

  constructor() { }

  ngOnInit() {}


  onChange(content: string) {
    this.content = content;
    this.contentChange.emit(this.content);
  }

}
