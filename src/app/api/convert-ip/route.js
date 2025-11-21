import { PythonShell } from 'python-shell';

export async function POST(request) {
    const { ip, direction } = await request.json();

    try {
        const result = await new Promise((resolve, reject) => {
            PythonShell.run('convertir-ips.py', {
                mode: 'text',
                pythonPath: 'python',
                args: [ip, direction]
            }, (err, output) => {
                if (err) reject(err);
                resolve(output);
            });
        });

        return Response.json({ success: true, result: result[0] });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}