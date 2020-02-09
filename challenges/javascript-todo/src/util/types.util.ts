import {BindingKey} from '@loopback/context';

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');

export type Credentials = {
  email: string;
  password: string;
};
