import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { getExistingShapes } from "./index";

// Re-export for backwards compatibility
export { getExistingShapes };

// This file is kept for backwards compatibility but delegates to index.ts