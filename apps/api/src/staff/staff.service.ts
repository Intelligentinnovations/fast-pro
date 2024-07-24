import { IServiceHelper } from '@backend-template/types';
import { Injectable } from '@nestjs/common';

import { UserRepo } from '../repository/user';
import { PaginationParams } from '../utils';

@Injectable()
export class StaffService {
  constructor(
    private userRepo: UserRepo,
  ) { }

  async fetchStaff ({ organizationId, paginationData }: { organizationId: string; paginationData: PaginationParams }): Promise<IServiceHelper>  {
    const staff = await this.userRepo.fetchOrganizationUsers({
      pagination: paginationData,
      organizationId
    })
    return {
    status: 'successful',
    message: "Staff fetched successfully",
    data: staff
  }
  }

  async delete ({ organizationId, id }: { organizationId: string; id: string}): Promise<IServiceHelper>  {
    await this.userRepo.deleteOrganizationUser({ organizationId, userId: id })
    return {
    status: 'deleted',
    message: "Staff deleted successfully"
    }
  }

}
