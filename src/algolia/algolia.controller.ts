import { Controller } from "@nestjs/common";
import { AlgoliaService } from "./algolia.service";

@Controller("algolia")
export class AlgoliaController {
  constructor(private readonly algoliaService: AlgoliaService) {}
}
