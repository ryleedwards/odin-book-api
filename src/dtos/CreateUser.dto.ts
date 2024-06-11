import { CreateProfileDto } from './CreateProfile.dto';
export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  profile?: CreateProfileDto;
}
