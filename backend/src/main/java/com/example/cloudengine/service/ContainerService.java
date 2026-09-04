package com.example.cloudengine.service;

import com.example.cloudengine.model.Container;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class ContainerService {
    private final List<Container> containers = new CopyOnWriteArrayList<>();
    private final Map<String, List<String>> logs = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public ContainerService() {
        // Initialize default containers
        containers.add(new Container("c1-nginx", "nginx-ingress", "nginx:alpine", 80, 15, 128, "running", "2 hours ago"));
        containers.add(new Container("c2-postgres", "postgres-db", "postgres:alpine", 5432, 45, 512, "running", "5 hours ago"));
        containers.add(new Container("c3-nodejs", "node-auth-api", "node:18-alpine", 3000, 25, 256, "stopped", "1 day ago"));
        containers.add(new Container("c4-redis", "redis-cache", "redis:alpine", 6379, 10, 128, "running", "3 days ago"));

        // Initialize logs
        for (Container c : containers) {
            initializeLogs(c);
        }

        // Start background thread to simulate running container logs
        new Thread(this::simulateLogStream).start();
    }

    private void initializeLogs(Container c) {
        List<String> containerLogs = new CopyOnWriteArrayList<>();
        containerLogs.add("[" + Instant.now() + "] [INFO] Starting container " + c.getName());
        containerLogs.add("[" + Instant.now() + "] [INFO] Executing entrypoint.sh");
        containerLogs.add("[" + Instant.now() + "] [INFO] Service is running on port " + c.getPort());
        containerLogs.add("[" + Instant.now() + "] [INFO] Database connected successfully.");
        logs.put(c.getId(), containerLogs);
    }

    public List<Container> getAllContainers() {
        return containers;
    }

    public Optional<Container> getContainerById(String id) {
        return containers.stream().filter(c -> c.getId().equals(id)).findFirst();
    }

    public Container createContainer(Container newContainer) {
        if (newContainer.getId() == null || newContainer.getId().isEmpty()) {
            newContainer.setId("c-" + UUID.randomUUID().toString().substring(0, 8));
        }
        newContainer.setCreated("Just now");
        containers.add(newContainer);
        initializeLogs(newContainer);
        return newContainer;
    }

    public boolean updateStatus(String id, String status) {
        Optional<Container> containerOpt = getContainerById(id);
        if (containerOpt.isPresent()) {
            Container container = containerOpt.get();
            container.setStatus(status);
            
            // Log the transition
            List<String> containerLogs = logs.computeIfAbsent(id, k -> new CopyOnWriteArrayList<>());
            containerLogs.add("[" + Instant.now() + "] [INFO] Container status changed to: " + status.toUpperCase());
            return true;
        }
        return false;
    }

    public boolean deleteContainer(String id) {
        Optional<Container> containerOpt = getContainerById(id);
        if (containerOpt.isPresent()) {
            containers.remove(containerOpt.get());
            logs.remove(id);
            return true;
        }
        return false;
    }

    public List<String> getLogs(String id) {
        return logs.getOrDefault(id, Collections.emptyList());
    }

    private void simulateLogStream() {
        while (true) {
            try {
                Thread.sleep(3000);
                for (Container c : containers) {
                    if ("running".equals(c.getStatus())) {
                        List<String> containerLogs = logs.get(c.getId());
                        if (containerLogs != null) {
                            String[] randomTemplates = {
                                "[" + Instant.now() + "] [DEBUG] GET /api/v1/status - 200 OK (8.2ms)",
                                "[" + Instant.now() + "] [DEBUG] Connection pool active: " + (random.nextInt(20) + 5) + " connections",
                                "[" + Instant.now() + "] [INFO] System health check passed - CPU: " + c.getCpu() + "%, RAM: " + c.getRam() + "MB",
                                "[" + Instant.now() + "] [WARN] Query execution time exceeds threshold: 120ms"
                            };
                            String newLog = randomTemplates[random.nextInt(randomTemplates.length)];
                            containerLogs.add(newLog);
                            // Keep last 100 logs to prevent memory leaks
                            if (containerLogs.size() > 100) {
                                containerLogs.remove(0);
                            }
                        }
                    }
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
}
