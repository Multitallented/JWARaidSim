import {ComponentFactoryResolver, Inject, Injectable, ViewContainerRef} from '@angular/core';
import {ArmyGroupListComponent} from "../army-group-list/army-group-list.component";

@Injectable({
  providedIn: 'root'
})
export class ArmyListFactoryService {

  private factoryResolver: ComponentFactoryResolver;
  private rootViewContainer: ViewContainerRef;

  lists = [];

  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver;
  }

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  addDynamicComponent(nation: string): ArmyGroupListComponent {
    const factory = this.factoryResolver.resolveComponentFactory(ArmyGroupListComponent);
    const component = factory.create(this.rootViewContainer.parentInjector);
    this.lists.push(this.rootViewContainer.length);
    this.rootViewContainer.insert(component.hostView);
    component.instance.selectNation(nation);
    return component.instance;
  }

  reset() {
    for (let i = this.lists.length - 1;  i > -1; i--) {
      this.rootViewContainer.remove(i);
    }
    this.lists = [];
  }
}
