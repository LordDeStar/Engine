import shader from "./shaders.wgsl";
const Init = async ()=>{
    const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
    const adapter: GPUAdapter =  <GPUAdapter> await navigator.gpu?.requestAdapter();
    const device: GPUDevice = <GPUDevice> await adapter?.requestDevice();
    const context: GPUCanvasContext = <GPUCanvasContext> canvas.getContext('webgpu');
    const format: GPUTextureFormat = "bgra8unorm";

    context.configure({
        device,
        format
    });

    const pipeline: GPURenderPipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code: shader
            }),
            entryPoint: "vs_main"
        },
        fragment: {
            module: device.createShaderModule({
                code: shader
            }),
            entryPoint: "fs_main",
            targets: [{
                format: format
            }]
        },
        primitive: {
            topology: "triangle-list"
        },
        layout: "auto"
    });

    const commandEncoder: GPUCommandEncoder = device.createCommandEncoder();
    const textureView: GPUTextureView = context.getCurrentTexture().createView();
    const renderpass: GPURenderPassEncoder = commandEncoder.beginRenderPass({
        colorAttachments:[{
            view: textureView,
            clearValue: {r:0.5, g:0.0, b: 0.25, a:1.0},
            loadOp: "clear",
            storeOp: "store"   
        }]
    });
    renderpass.setPipeline(pipeline);
    renderpass.draw(3,1,0,0);
    renderpass.end();
    device.queue.submit([commandEncoder.finish()]);
}
Init();