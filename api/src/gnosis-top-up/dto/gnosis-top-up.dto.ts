/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty } from 'class-validator';

export class GnosisTopUpDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  gnosisRecipient: string;

  @IsString()
  @IsNotEmpty()
  amountInt: string;
}
