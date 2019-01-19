import { Component, OnInit, Input } from '@angular/core';

interface DynamicFormField {
  name: string;
  label?: string;
  optional?: boolean;
  value?: any;
  fields?: DynamicFormField[];
}

interface TreeNodeInterface {
  key: string;
  name: string;
  label: string;
  type: string;
  value: string;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
}

@Component({
  selector: 'app-dynamic-form-table',
  templateUrl: './dynamic-form-table.component.html',
  styleUrls: ['./dynamic-form-table.component.scss']
})
export class DynamicFormTableComponent implements OnInit {

  @Input()
  set form(form: DynamicFormField) {
    this.data = [this.buildDynamicFormTree(form)];
    console.log(this.data);
    this.data.forEach(item => {
      this.expandDataCache[ item.key ] = this.convertTreeToList(item);
    });
  }

  data: TreeNodeInterface[] = [];
  expandDataCache = {};

  constructor() { }

  ngOnInit(): void {
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[ i ], level: node.level + 1, expand: true, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: object, array: TreeNodeInterface[]): void {
    if (!hashMap[ node.key ]) {
      hashMap[ node.key ] = true;
      array.push(node);
    }
  }

  buildDynamicFormTree(f: DynamicFormField) {
    const node: TreeNodeInterface = {name: '', key: '', value: '', label: '', type: ''};
    if (!f) {
      return node;
    }
    node.name  = f.name;
    node.label = f.label;
    node.key   = node.name + node.label;

    if (f.value) {
      node.type = f.value.type;
      Object.keys(f.value).forEach(key => {
        node.value += (key === 'type') ? '' : `${key}: ${f.value[key]}`;
      });
    }

    if (f.fields && f.fields.length) {
      node.children = f.fields.map(field => this.buildDynamicFormTree(field));
    }

    return node;
  }

}
