import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDatabases'
})
export class FilterDatabasesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
