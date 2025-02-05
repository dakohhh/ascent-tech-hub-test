import { Test, TestingModule } from "@nestjs/testing";
import { DvaService } from "./dva.service";

describe("DvaService", () => {
  let service: DvaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DvaService],
    }).compile();

    service = module.get<DvaService>(DvaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
