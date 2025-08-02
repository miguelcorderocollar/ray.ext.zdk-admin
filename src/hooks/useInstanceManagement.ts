import { useState, useEffect } from "react";
import { getZendeskInstances, ZendeskInstance } from "../utils/preferences";

export function useInstanceManagement() {
  const [allInstances, setAllInstances] = useState<ZendeskInstance[]>([]);
  const [currentInstance, setCurrentInstance] = useState<ZendeskInstance | undefined>();

  useEffect(() => {
    const instances = getZendeskInstances();
    setAllInstances(instances);

    // Set first instance as default if available
    if (instances.length > 0 && !currentInstance) {
      setCurrentInstance(instances[0]);
    }
  }, []);

  const switchInstance = (instance: ZendeskInstance) => {
    setCurrentInstance(instance);
  };

  const hasInstances = allInstances.length > 0;

  return {
    allInstances,
    currentInstance,
    switchInstance,
    hasInstances,
  };
}
