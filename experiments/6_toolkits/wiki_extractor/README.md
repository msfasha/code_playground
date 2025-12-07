# Usage

Download wikipedia dump, select the articles files not the index.
https://ftp.acc.umu.se/mirror/wikimedia.org/dumps/arwiki/20210820/

for example, I downloaded this dump file:
arwiki-20210820-pages-articles-multistream.xml.bz2g

create project diretory
create and activate python virtual environment

python3 -m venv env
source ... activate

Download or install wikiextractor tool
https://pythonrepo.com/repo/attardi-wikiextractor-python-third-party-apis-wrappers
https://github.com/apertium/WikiExtractor

pip install wikiextractor

use the tool on the dump file .bz2 directly e.g.
python -m wikiextractor.WikiExtractor ~/Downloads/arwiki-20210820-pages-articles-multistream.xml.bz2

The output of this command is a folder with the name (text) which includes a set of directories AA AB AC AD...etc.
Each directory contains a set of files wiki_00 wiki_01 ...etc
Each file has a number of pure text articles:

ماء

الماء مادةٌ شفافةٌ عديمة اللون والرائحة، وهو المكوّن الأساسي للجداول والبحيرات والبحار والمحيطات وكذلك للسوائل في جميع الكائنات الحيّة، وهو أكثر المركّبات الكيميائيّة انتشاراً على سطح الأرض. يتألّف جزيء الماء من ذرّة أكسجين مركزية ترتبط بها ذرّتا هيدروجين على طرفيها برابطة تساهميّة بحيث تكون صيغته الكيميائية H2O. عند الظروف القياسية من الضغط ودرجة الحرارة يكون الماء سائلاً؛ أمّا الحالة الصلبة فتتشكّل عند نقطة التجمّد، وتدعى بالجليد؛ أمّا الحالة الغازية فتتشكّل عند نقطة الغليان، وتسمّى بخار الماء.
إنّ الماء هو أساس وجود الحياة على كوكب الأرض، وهو يغطّي 71% من سطحها، وتمثّل مياه البحار والمحيطات أكبر نسبة للماء على الأرض، حيث تبلغ حوالي 96.5%. وتتوزّع النسب الباقية بين المياه الجوفيّة وبين جليد المناطق القطبيّة (1.7% لكليهما)، مع وجود نسبة صغيرة على شكل بخار ماء معلّق في الهواء على هيئة سحاب (غيوم)، وأحياناً أخرى على هيئة ضباب أو ندى، بالإضافة إلى الزخات المطريّة أو الثلجيّة. تبلغ نسبة الماء العذب حوالي 2.5% فقط من الماء الموجود على الأرض، وأغلب هذه الكمّيّة (حوالي 99%) موجودة في الكتل الجليديّة في المناطق القطبيّة، في حين تتواجد 0.3% من الماء العذب في الأنهار والبحيرات وفي الغلاف الجوّي.
أما في الطبيعة، فتتغيّر حالة الماء بين الحالات الثلاثة للمادة على سطح الأرض باستمرار من خلال ما يعرف باسم الدورة المائيّة (أو دورة الماء)، والتي تتضمّن حدوث تبخّر ونتح (نتح تبخّري) ثم تكثيف فهطول ثم جريان لتصل إلى المصبّ في المسطّحات المائيّة.
شكّل الحصول على مصدر نقي من مياه الشرب أمراً مهمّاً لنشوء الحضارات عبر التاريخ. وفي العقود الأخيرة، سجلت حالات شحّ في المياه العذبة في مناطق عديدة من العالم، ولقد قدّرت إحصاءات الأمم المتّحدة أنّ حوالي مليار شخص على سطح الأرض لا يزالون يفتقرون الوسائل المتاحة للوصول إلى مصدر آمن لمياه الشرب، وأنّ حوالي 2.5 مليار يفتقرون إلى وسيلة ملائمة من أجل تطهير المياه.
الخواص الفيزيائية والكيميائية.
يمكن إيراد الخواص الكيميائيّة والفيزيائيّة الأساسيّة للماء على شكل النقاط التالية:
الماء في الكون.
