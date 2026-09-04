package com.example.cloudengine.controller;

import com.example.cloudengine.model.Container;
import com.example.cloudengine.service.ContainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContainerController {

    @Autowired
    private ContainerService containerService;

    @GetMapping("/containers")
    public List<Container> getContainers() {
        return containerService.getAllContainers();
    }

    @PostMapping("/containers")
    public ResponseEntity<Container> deployContainer(@RequestBody Container container) {
        Container created = containerService.createContainer(container);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/containers/{id}/start")
    public ResponseEntity<?> startContainer(@PathVariable String id) {
        boolean updated = containerService.updateStatus(id, "running");
        if (updated) {
            return ResponseEntity.ok(Map.of("message", "Container started successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/containers/{id}/stop")
    public ResponseEntity<?> stopContainer(@PathVariable String id) {
        boolean updated = containerService.updateStatus(id, "stopped");
        if (updated) {
            return ResponseEntity.ok(Map.of("message", "Container stopped successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/containers/{id}/restart")
    public ResponseEntity<?> restartContainer(@PathVariable String id) {
        containerService.updateStatus(id, "restarting");
        
        // Simulating immediate/quick transition back to running
        new Thread(() -> {
            try {
                Thread.sleep(1500);
                containerService.updateStatus(id, "running");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();

        return ResponseEntity.ok(Map.of("message", "Container restarting initiated"));
    }

    @DeleteMapping("/containers/{id}")
    public ResponseEntity<?> deleteContainer(@PathVariable String id) {
        boolean deleted = containerService.deleteContainer(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Container deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/containers/{id}/logs")
    public ResponseEntity<List<String>> getLogs(@PathVariable String id) {
        List<String> logs = containerService.getLogs(id);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/system/info")
    public ResponseEntity<Map<String, String>> getSystemInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("OS", "Linux Alpine 3.18.2");
        info.put("Arch", "x86_64");
        info.put("Kernel", "5.15.49-linuxkit");
        info.put("DockerVersion", "24.0.7");
        info.put("CPUs", "4");
        info.put("RAM", "8.00 GB");
        return ResponseEntity.ok(info);
    }
}
