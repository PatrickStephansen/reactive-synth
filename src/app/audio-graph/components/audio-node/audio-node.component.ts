import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-audio-node',
  templateUrl: './audio-node.component.html',
  styleUrls: ['./audio-node.component.scss']
})
export class AudioNodeComponent implements OnInit {
  @Input() nodeId: string;
  @Input() nodeType: string;

  selectedDestinationId: string | null;

  constructor() {}

  ngOnInit() {}
}
