import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title, Meta } from '@angular/platform-browser';
declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Hrms eispowered';
  constructor(router: Router, private titleService: Title, private metaService: Meta) {
    const navEndEvents = router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );
    navEndEvents.subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-165836157-2', {
        // tslint:disable-next-line: object-literal-key-quotes
        'page_path': event.urlAfterRedirects
      });
    });
  }
  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      { name: 'keywords', content: 'eispowered hrms, hrms eispowered' },
      { name: 'description', content: 'eispowered hrms' },
      { name: 'robots', content: 'index, follow' }
    ]);
  }
}
