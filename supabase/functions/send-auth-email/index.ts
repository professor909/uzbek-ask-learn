import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  email: string;
  type: 'signup' | 'recovery' | 'email_change';
  token?: string;
  confirmationUrl?: string;
}

const getEmailContent = (type: string, email: string, confirmationUrl?: string) => {
  const siteName = "Учебный Центр";
  const siteUrl = "https://forskull.vercel.app";
  
  switch (type) {
    case 'signup':
      return {
        subject: `Добро пожаловать в ${siteName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🎓 ${siteName}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Платформа для обучения и обмена знаниями</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 15px; padding: 30px; margin: 20px 0;">
              <h2 style="margin: 0 0 20px 0; color: white;">Добро пожаловать!</h2>
              <p style="margin: 0 0 15px 0; line-height: 1.6;">
                Спасибо за регистрацию на нашей платформе! Для завершения регистрации, пожалуйста, подтвердите свой email адрес.
              </p>
              ${confirmationUrl ? `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmationUrl}" 
                     style="display: inline-block; background: white; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    Подтвердить Email
                  </a>
                </div>
              ` : ''}
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                <h3 style="margin: 0 0 15px 0; color: white;">Что вас ждёт:</h3>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>📚 Задавайте вопросы и получайте ответы от экспертов</li>
                  <li>🏆 Зарабатывайте баллы за полезные ответы</li>
                  <li>⭐ Повышайте свой рейтинг и статус</li>
                  <li>🤝 Помогайте другим студентам в обучении</li>
                </ul>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; opacity: 0.8;">
              <p style="margin: 0; font-size: 14px;">
                Если у вас есть вопросы, свяжитесь с нами по адресу: 
                <a href="mailto:support@${siteName.toLowerCase()}.ru" style="color: white;">support@${siteName.toLowerCase()}.ru</a>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px;">
                © 2024 ${siteName}. Все права защищены.
              </p>
            </div>
          </div>
        `
      };
      
    case 'recovery':
      return {
        subject: `Восстановление пароля - ${siteName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🔐 Восстановление пароля</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">${siteName}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 15px; padding: 30px; margin: 20px 0;">
              <p style="margin: 0 0 20px 0; line-height: 1.6;">
                Мы получили запрос на восстановление пароля для вашего аккаунта <strong>${email}</strong>.
              </p>
              
              ${confirmationUrl ? `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmationUrl}" 
                     style="display: inline-block; background: white; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    Сбросить пароль
                  </a>
                </div>
              ` : ''}
              
              <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                  ⏰ Эта ссылка действительна в течение 1 часа из соображений безопасности.
                </p>
              </div>
              
              <p style="margin: 20px 0 0 0; font-size: 14px; opacity: 0.8;">
                Если вы не запрашивали восстановление пароля, проигнорируйте это письмо. Ваш пароль не будет изменён.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; opacity: 0.8;">
              <p style="margin: 0; font-size: 14px;">
                По вопросам безопасности: 
                <a href="mailto:security@${siteName.toLowerCase()}.ru" style="color: white;">security@${siteName.toLowerCase()}.ru</a>
              </p>
            </div>
          </div>
        `
      };
      
    default:
      return {
        subject: `Уведомление от ${siteName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>${siteName}</h1>
            <p>Спасибо за использование нашей платформы!</p>
          </div>
        `
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, confirmationUrl }: AuthEmailRequest = await req.json();
    
    console.log(`Sending ${type} email to ${email}`);

    const emailContent = getEmailContent(type, email, confirmationUrl);

    const emailResponse = await resend.emails.send({
      from: "Учебный Центр <noreply@resend.dev>", // Замените на ваш верифицированный домен
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully",
      id: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);