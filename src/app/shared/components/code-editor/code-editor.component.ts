import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MonacoFile, MonacoEditorOptions } from 'ngx-monaco';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {

  @Input()
  language: string = 'html';

  @Input()
  content: string = '';

  @Input()
  theme: string = 'vc';

  @Input()
  height: number = 300;

  @Output()
  contentChange = new EventEmitter();

  file: MonacoFile;
  options: MonacoEditorOptions;

  constructor() { }

  ngOnInit() {
    this.file = {
      uri: '',
      language: this.language,
      content: this.content
    };
    this.options = {
      minimap: {
        enabled: false
      },
      autoIndent: true
    }
  }

  onChange(file) {
    this.content = file.content;
    this.contentChange.emit(this.content);
  }

}
