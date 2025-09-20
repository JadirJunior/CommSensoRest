import DeviceClaim from "./database/models/DeviceClaim";
import AppService from "./services/AppService";
import ContainerService from "./services/ContainerService";
import DeviceClaimService from "./services/DeviceClaimService";
import DeviceService from "./services/DeviceService";
import MeasureService from "./services/MeasureService";
import SensorTypeService from "./services/SensorTypeService";
import TenantService from "./services/TenantService";
import UserService from "./services/UserService";

class Registry {
	services: Map<string, any>;

	constructor() {
		this.services = new Map();
	}

	register(name: string, instance: any) {
		this.services.set(name, instance);
	}

	resolve(name: string) {
		return this.services.get(name);
	}
}

const registry = new Registry();

registry.register("AppService", new AppService());
registry.register("ContainerService", new ContainerService());
registry.register("DeviceClaimService", new DeviceClaimService());
registry.register("DeviceService", new DeviceService(DeviceClaim));
registry.register(
	"MeasureService",
	new MeasureService(
		registry.resolve("ContainerService") as ContainerService,
		registry.resolve("DeviceService") as DeviceService
	)
);
registry.register("SensorTypeService", new SensorTypeService());
registry.register("TenantService", new TenantService());
registry.register("UserService", new UserService());

export default registry;
