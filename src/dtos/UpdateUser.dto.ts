import { UpdateProfileDto } from './UpdateProfile.dto';

export interface UpdateUserDto {
  id: number;
  email: string;
  name: string;
  password: string;
  profile?: UpdateProfileDto;
}
