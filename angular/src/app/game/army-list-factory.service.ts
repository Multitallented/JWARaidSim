import {ComponentFactoryResolver, Inject, Injectable} from '@angular/core';
import {ArmyGroupListComponent} from "../army-group-list/army-group-list.component";

@Injectable({
  providedIn: 'root'
})
export class ArmyListFactoryService {

  private factoryResolver: ComponentFactoryResolver;
  private rootViewContainer: any;

  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver;
  }

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  addDynamicComponent(nation: string): ArmyGroupListComponent {
    const factory = this.factoryResolver.resolveComponentFactory(ArmyGroupListComponent);
    const component = factory.create(this.rootViewContainer.parentInjector);
    this.rootViewContainer.insert(component.hostView);
    component.instance.selectNation(nation);
    return component.instance;
  }
}
