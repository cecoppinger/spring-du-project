import {
  JsonController,
  Get,
  Param,
  Res,
  Body,
  Post,
  Put,
  Delete
} from "routing-controllers";
import { ConsultantService } from "../services/consultantService";
import { IConsultant } from "../interfaces/consultant";
import { Response } from "express";
import { IComment } from "../interfaces/comment";

@JsonController()
export class ConsultantsController {
  private consultantService: ConsultantService;

  constructor(consultantService: ConsultantService) {
    this.consultantService = consultantService;
  }

  @Get("/consultants")
  public getConsultants(@Res() res: Response) {
    return this.consultantService.getConsultants();
  }

  //gets a consultant with all of their comments
  @Get("/consultants/:id")
  public getConsultantById(@Param("id") id: string): Promise<IConsultant> {
    return this.consultantService.getConsultantById(id);
  }

  @Put("/consultants/:id")
  public async updateConsultant(
    @Param("id") id: string,
    @Body() updated: IConsultant
  ): Promise<IConsultant> {
    return this.consultantService.updateConsultant(id, updated);
  }

  @Post("/consultants")
  public createConsultant(@Body() consultant: IConsultant) {
    return this.consultantService.createConsultant(consultant);
  }

  @Delete("/consultants/:id")
  public deleteConsultant(@Param("id") id: string) {
    this.consultantService.deleteConsultantById(id);
    return {
      message: `Delete consultant with id: ${id}`
    };
  }

  //adds a comment to a consultant with their id
  @Post("/consultants/:id")
  public addCommentToConsultant(
    @Param("id") id: string,
    @Body() comment: IComment
  ) {
    return this.consultantService.addComment(id, comment);
  }
}
